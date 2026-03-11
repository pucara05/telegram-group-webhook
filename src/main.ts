import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TelegramService } from './telegram/telegram.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);

  // Registra el webhook automáticamente al arrancar
  const telegramService = app.get(TelegramService);
  const ngrokUrl = process.env.NGROK_URL;
  if (ngrokUrl) {
    await telegramService.setWebhook(`${ngrokUrl}/telegram/webhook`);
  }
}
bootstrap();