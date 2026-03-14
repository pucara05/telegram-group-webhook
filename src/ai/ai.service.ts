import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GeminiService } from './providers/gemini.service';
import { GroqService } from './providers/groq.service';
import { IAiProvider } from './interfaces/ai-provider.interface';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly provider: IAiProvider;

  constructor(
    private readonly configService: ConfigService,
    private readonly geminiService: GeminiService,
    private readonly groqService: GroqService,
  ) {
    const providerName = this.configService.get<string>('AI_PROVIDER') ?? 'groq';

    if (providerName === 'gemini') {
      this.provider = this.geminiService;
      this.logger.log('🤖 Usando Gemini como proveedor de IA');
    } else {
      this.provider = this.groqService;
      this.logger.log('🤖 Usando Groq como proveedor de IA');
    }
  }

  // ← ahora recibe y pasa el chatId
  async processMessage(userMessage: string, chatId: string): Promise<string> {
    return this.provider.processMessage(userMessage, chatId);
  }
}