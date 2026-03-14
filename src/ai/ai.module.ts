import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { GeminiService } from './providers/gemini.service';
import { GroqService } from './providers/groq.service';

@Module({
  providers: [AiService, GeminiService, GroqService],
  exports: [AiService], // ← importante para que TelegramModule lo pueda usar
})
export class AiModule {}