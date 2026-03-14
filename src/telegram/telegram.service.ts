import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiService } from '../ai/ai.service';
import axios from 'axios';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly apiUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly aiService: AiService,
  ) {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    this.apiUrl = `https://api.telegram.org/bot${token}`;
  }

  async handleIncomingMessage(body: any): Promise<void> {
    try {
      const message = body?.message;

      if (!message) {
        this.logger.warn('Evento recibido pero sin mensaje');
        return;
      }

      const chatId = String(message.chat?.id);   // ← convertimos a string
      const chatName = message.chat?.title ?? 'Chat privado';
      const username = message.from?.username ?? message.from?.first_name ?? 'Desconocido';
      const text = message?.text ?? null;
      const chatType = message.chat?.type;

      this.logger.log(`💬 [${chatType}] ${chatName}`);
      this.logger.log(`👤 ${username}: ${text}`);

      if (!text) return;

      // Pasamos el chatId para que el historial sea por chat
      const aiResponse = await this.aiService.processMessage(text, chatId);

      await this.sendMessage(message.chat.id, aiResponse);

    } catch (error) {
      this.logger.error('Error procesando mensaje', error);
    }
  }

  async sendMessage(chatId: number, text: string): Promise<void> {
    try {
      await axios.post(`${this.apiUrl}/sendMessage`, {
        chat_id: chatId,
        text,
      });
      this.logger.log(`✅ Respuesta enviada al chat ${chatId}`);
    } catch (error) {
      this.logger.error('Error enviando mensaje', error);
    }
  }

  async setWebhook(url: string): Promise<void> {
    try {
      await axios.post(`${this.apiUrl}/setWebhook`, { url });
      this.logger.log(`✅ Webhook registrado: ${url}`);
    } catch (error) {
      this.logger.error('Error registrando webhook', error);
    }
  }
}