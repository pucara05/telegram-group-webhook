import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';
import { IAiProvider } from '../interfaces/ai-provider.interface';

@Injectable()
export class GroqService implements IAiProvider {
  private readonly logger = new Logger(GroqService.name);
  private readonly groq: Groq;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GROQ_API_KEY');
    this.groq = new Groq({ apiKey });
  }

  async processMessage(userMessage: string): Promise<string> {
    try {
      const response = await this.groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: userMessage }],
      });
      const result = response.choices[0]?.message?.content ?? 'No pude procesar tu mensaje';
      this.logger.log(`🤖 Groq respondió: ${result}`);
      return result;
    } catch (error) {
      this.logger.error('Error llamando a Groq', error);
      return 'Hubo un error procesando tu mensaje';
    }
  }
}