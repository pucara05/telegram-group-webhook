import { Injectable } from '@nestjs/common';

@Injectable()
export class DatetimeService {
  getDatetime(timezone: string): string {
    try {
      const now = new Date();
      const formatted = now.toLocaleString('es-ES', {
        timeZone: timezone,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      return `📅 Fecha y hora en ${timezone}:\n${formatted}`;
    } catch {
      return `Zona horaria no válida: ${timezone}.\nEjemplos válidos: America/Bogota, America/Lima, Asia/Tokyo`;
    }
  }
}