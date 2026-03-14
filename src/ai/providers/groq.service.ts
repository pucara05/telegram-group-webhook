import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';
import { ChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions';
import { IAiProvider } from '../interfaces/ai-provider.interface';
import { ToolsService } from '../../tools/tools.service';

const MAX_HISTORY = 6;

@Injectable()
export class GroqService implements IAiProvider {
  private readonly logger = new Logger(GroqService.name);
  private readonly groq: Groq;
  private readonly histories = new Map<string, ChatCompletionMessageParam[]>();

  constructor(
    private readonly configService: ConfigService,
    private readonly toolsService: ToolsService,
  ) {
    const apiKey = this.configService.get<string>('GROQ_API_KEY');
    this.groq = new Groq({ apiKey });
  }

  private getHistory(chatId: string): ChatCompletionMessageParam[] {
    if (!this.histories.has(chatId)) {
      this.histories.set(chatId, []);
    }
    return this.histories.get(chatId)!;
  }

  private addToHistory(chatId: string, message: ChatCompletionMessageParam): void {
    const history = this.getHistory(chatId);
    history.push(message);
    while (history.length > MAX_HISTORY) {
      history.splice(0, 2);
    }
  }

  async processMessage(userMessage: string, chatId: string): Promise<string> {
    try {
      const history = this.getHistory(chatId);

      // Paso 1 — Detectar intención con historial pero SIN tools
      // Así el modelo solo decide qué herramienta usar sin generar el llamado
      const intentResponse = await this.groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `Eres un clasificador de intenciones. Analiza el mensaje del usuario con el contexto de la conversación y responde SOLO con un JSON así:
{
  "needsTool": true/false,
  "tool": "get_weather" | "get_datetime" | null,
  "parameter": "valor del parámetro" | null,
  "resolvedMessage": "mensaje completo resuelto con contexto"
}

Ejemplos:
- "y en japón?" después de hablar de hora → {"needsTool":true,"tool":"get_datetime","parameter":"Asia/Tokyo","resolvedMessage":"qué hora es en Japón"}
- "hace calor allá?" después de hablar de Lima → {"needsTool":true,"tool":"get_weather","parameter":"Lima","resolvedMessage":"qué clima hace en Lima"}
- "cuéntame un chiste" → {"needsTool":false,"tool":null,"parameter":null,"resolvedMessage":"cuéntame un chiste"}

IMPORTANTE: Responde SOLO con el JSON, sin texto extra.`,
          },
          ...history,
          { role: 'user', content: userMessage },
        ],
      });

      const intentText = intentResponse.choices[0]?.message?.content ?? '{}';
      let intent: any = {};

      try {
        intent = JSON.parse(intentText);
      } catch {
        this.logger.warn('No se pudo parsear intención, respondiendo directo');
        intent = { needsTool: false };
      }

      this.logger.log(`🧠 Intención: ${JSON.stringify(intent)}`);

      let finalResult = '';

      if (intent.needsTool && intent.tool && intent.parameter) {
        // Paso 2 — Ejecutar la herramienta directamente sin pasar por el LLM
        this.logger.log(`🔧 Herramienta: ${intent.tool}`);
        this.logger.log(`📦 Parámetro: ${intent.parameter}`);

        const toolArgs = intent.tool === 'get_weather'
          ? { city: intent.parameter }
          : { timezone: intent.parameter };

        const toolResult = await this.toolsService.executeTool(intent.tool, toolArgs);
        this.logger.log(`📊 Resultado: ${toolResult}`);

        // Paso 3 — Interpretar resultado con LLM simple sin tools
        const interpretResponse = await this.groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'Eres un asistente útil. Responde siempre en español de forma clara y concisa. Usa SOLO los datos que te dan, no agregues información extra.',
            },
            {
              role: 'user',
              content: `El usuario preguntó: "${intent.resolvedMessage}"\n\nDatos obtenidos:\n${toolResult}\n\nResponde de forma natural y concisa.`,
            },
          ],
        });

        finalResult = interpretResponse.choices[0]?.message?.content
          ?? 'No pude procesar la respuesta';

      } else {
        // Paso 2b — Respuesta directa con historial
        const directResponse = await this.groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'Eres un asistente útil. Responde siempre en español.',
            },
            ...history,
            { role: 'user', content: userMessage },
          ],
        });

        finalResult = directResponse.choices[0]?.message?.content
          ?? 'No pude procesar tu mensaje';
      }

      this.logger.log(`🤖 Groq respondió: ${finalResult}`);

      // Guarda en historial
      this.addToHistory(chatId, { role: 'user', content: userMessage });
      this.addToHistory(chatId, { role: 'assistant', content: finalResult });

      return finalResult;

    } catch (error) {
      this.logger.error('Error llamando a Groq', error);
      const history = this.getHistory(chatId);
      if (history.length > 0) history.pop();
      return 'Hubo un error procesando tu mensaje, intenta de nuevo';
    }
  }
}