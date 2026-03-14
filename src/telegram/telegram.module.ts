import { Module } from '@nestjs/common';
import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';
import { AiModule } from '../ai/ai.module'; // ← agregar

@Module({
  imports: [AiModule],        // ← agregar
  controllers: [TelegramController],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule { }