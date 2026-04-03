import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { GeminiService } from './providers/gemini.service';
import { GroqService } from './providers/groq.service';
import { ToolsModule } from '../tools/tools.module';
import { RedisModule } from '../common/redis/redis.module'; 

@Module({
  imports: [ToolsModule, RedisModule], // ← importa ToolsModule y RedisModule para que GroqService pueda usar ToolsService y RedisService
  providers: [AiService, GeminiService, GroqService],
  exports: [AiService], // ← importante para que TelegramModule lo pueda usar
})
export class AiModule { }