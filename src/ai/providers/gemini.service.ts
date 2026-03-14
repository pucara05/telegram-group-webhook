import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { IAiProvider } from '../interfaces/ai-provider.interface';

@Injectable()
export class GeminiService implements IAiProvider {
  private readonly logger = new Logger(GeminiService.name);
  private readonly genai: GoogleGenAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    this.genai = new GoogleGenAI({ apiKey });
  }

  async processMessage(userMessage: string): Promise<string> {
    try {
      const response = await this.genai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: userMessage,
      });
      const result = response.text ?? 'No pude procesar tu mensaje';
      this.logger.log(`🤖 Gemini respondió: ${result}`);
      return result;
    } catch (error) {
      this.logger.error('Error llamando a Gemini', error);
      return 'Hubo un error procesando tu mensaje';
    }
  }
}