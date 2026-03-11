import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly apiUrl: string;

  constructor(private readonly configService: ConfigService) {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    this.apiUrl = `https://api.telegram.org/bot${token}`;
  }

  // Procesa y muestra el mensaje en consola
  handleIncomingMessage(body: any): void {
    try {
      const message = body?.message;

      if (!message) {
        this.logger.warn('Evento recibido pero sin mensaje');
        return;
      }

      const chatName = message.chat?.title ?? 'Chat privado';
      const username = message.from?.username ?? message.from?.first_name ?? 'Desconocido';
      const text = message?.text ?? 'Mensaje sin texto';
      const chatType = message.chat?.type; // group, supergroup, private

      this.logger.log(`💬 [${chatType}] ${chatName}`);
      this.logger.log(`👤 ${username}: ${text}`);
    } catch (error) {
      this.logger.error('Error procesando mensaje', error);
    }
  }

  // Registra el webhook con Telegram
  async setWebhook(url: string): Promise<void> {
    try {
      await axios.post(`${this.apiUrl}/setWebhook`, { url });
      this.logger.log(`✅ Webhook registrado: ${url}`);
    } catch (error) {
      this.logger.error('Error registrando webhook', error);
    }
  }
}