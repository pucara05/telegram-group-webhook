import { Controller, Post, Body, Res, HttpStatus, Logger } from '@nestjs/common';
import  type { Response } from 'express';
import { TelegramService } from './telegram.service';

@Controller('telegram')
export class TelegramController {
  private readonly logger = new Logger(TelegramController.name);

  constructor(private readonly telegramService: TelegramService) {}


  @Post('webhook')
async receiveMessage(@Body() body: any, @Res() res: Response) {
  this.logger.log('📨 Nuevo mensaje de Telegram');
  await this.telegramService.handleIncomingMessage(body); // ← await
  return res.status(HttpStatus.OK).json({ status: 'ok' });
}
}