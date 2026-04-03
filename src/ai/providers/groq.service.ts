import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';
import { ChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions';
import { IAiProvider } from '../interfaces/ai-provider.interface';
import { ToolsService } from '../../tools/tools.service';
import { RedisService } from 'src/common/redis/redis.service';

const MAX_HISTORY = 6;

@Injectable()
export class GroqService implements IAiProvider {
  private readonly logger = new Logger(GroqService.name);
  private readonly groq: Groq;

  constructor(
    private readonly configService: ConfigService,
    private readonly toolsService: ToolsService,
    private readonly redisService: RedisService,
  ) {
    const apiKey = this.configService.get<string>('GROQ_API_KEY');
    this.groq = new Groq({ apiKey });
  }

  // 🔥 Obtener historial desde Redis
  private async getHistory(chatId: string): Promise<ChatCompletionMessageParam[]> {
    const data = await this.redisService.get(`chat:${chatId}`);
    return data ? JSON.parse(data) : [];
  }

  // 🔥 Guardar historial en Redis
  private async saveHistory(
    chatId: string,
    history: ChatCompletionMessageParam[],
  ): Promise<void> {
    await this.redisService.set(`chat:${chatId}`, JSON.stringify(history));
  }

  // 🔥 Agregar mensaje al historial
  private async addToHistory(
    chatId: string,
    message: ChatCompletionMessageParam,
  ): Promise<void> {
    const history = await this.getHistory(chatId);

    history.push(message);

    // limitar historial
    while (history.length > MAX_HISTORY) {
      history.splice(0, 2);
    }

    await this.saveHistory(chatId, history);
  }

  async processMessage(userMessage: string, chatId: string): Promise<string> {
    try {
      const history = await this.getHistory(chatId);

      // 🔹 Paso 1 — Detectar intención
      const intentResponse = await this.groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `Eres un clasificador de intenciones. Analiza el mensaje del usuario con el contexto de la conversación y responde SOLO con un JSON válido:

{
  "needsTool": true/false,
  "tool": "get_weather" | "get_datetime" | null,
  "parameter": "valor" | null,
  "resolvedMessage": "mensaje completo"
}

IMPORTANTE:
- Responde SOLO JSON
- NO agregues texto extra`,
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
        this.logger.warn('⚠️ JSON inválido, fallback a respuesta directa');
        intent = { needsTool: false };
      }

      this.logger.log(`🧠 Intención: ${JSON.stringify(intent)}`);

      let finalResult = '';

      // 🔹 Paso 2 — Si necesita tool
      if (intent.needsTool && intent.tool && intent.parameter) {
        this.logger.log(`🔧 Tool: ${intent.tool}`);
        this.logger.log(`📦 Param: ${intent.parameter}`);

        const toolArgs =
          intent.tool === 'get_weather'
            ? { city: intent.parameter }
            : { timezone: intent.parameter };

        const toolResult = await this.toolsService.executeTool(
          intent.tool,
          toolArgs,
        );

        this.logger.log(`📊 Resultado tool: ${toolResult}`);

        // 🔹 Paso 3 — Interpretar resultado
        const interpretResponse = await this.groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content:
                'Eres un asistente útil. Responde en español, claro y conciso. Usa SOLO los datos proporcionados.',
            },
            {
              role: 'user',
              content: `Pregunta: "${intent.resolvedMessage}"

Datos:
${toolResult}

Responde naturalmente.`,
            },
          ],
        });

        finalResult =
          interpretResponse.choices[0]?.message?.content ??
          'No pude procesar la respuesta';
      } else {
        // 🔹 Respuesta directa
        const directResponse = await this.groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'Eres un asistente útil. Responde en español.',
            },
            ...history,
            { role: 'user', content: userMessage },
          ],
        });

        finalResult =
          directResponse.choices[0]?.message?.content ??
          'No pude procesar tu mensaje';
      }

      this.logger.log(`🤖 Respuesta: ${finalResult}`);

      // 🔥 Guardar historial en Redis
      await this.addToHistory(chatId, {
        role: 'user',
        content: userMessage,
      });

      await this.addToHistory(chatId, {
        role: 'assistant',
        content: finalResult,
      });

      return finalResult;
    } catch (error) {
      this.logger.error('❌ Error en Groq', error);

      return 'Hubo un error procesando tu mensaje, intenta de nuevo';
    }
  }
}