import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { GeminiService } from './providers/gemini.service';
import { GroqService } from './providers/groq.service';
import { ToolsModule } from '../tools/tools.module';

@Module({
  imports: [ToolsModule], // ← importa ToolsModule para que GroqService pueda usar ToolsService
  providers: [AiService, GeminiService, GroqService],
  exports: [AiService], // ← importante para que TelegramModule lo pueda usar
})
export class AiModule { }