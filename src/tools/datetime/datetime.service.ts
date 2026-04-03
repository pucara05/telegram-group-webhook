import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class DatetimeService {
  private readonly logger = new Logger(DatetimeService.name);

  // Mapa de ciudades y países comunes a zonas horarias IANA
  private readonly timezoneMap: Record<string, string> = {
    // América
    'colombia': 'America/Bogota',
    'bogota': 'America/Bogota',
    'peru': 'America/Lima',
    'lima': 'America/Lima',
    'mexico': 'America/Mexico_City',
    'ciudad de mexico': 'America/Mexico_City',
    'argentina': 'America/Argentina/Buenos_Aires',
    'buenos aires': 'America/Argentina/Buenos_Aires',
    'chile': 'America/Santiago',
    'santiago': 'America/Santiago',
    'brasil': 'America/Sao_Paulo',
    'sao paulo': 'America/Sao_Paulo',
    'nueva york': 'America/New_York',
    'new york': 'America/New_York',
    'los angeles': 'America/Los_Angeles',
    'chicago': 'America/Chicago',
    'toronto': 'America/Toronto',
    'canada': 'America/Toronto',
    'venezuela': 'America/Caracas',
    'caracas': 'America/Caracas',
    'ecuador': 'America/Guayaquil',
    'quito': 'America/Guayaquil',
    'bolivia': 'America/La_Paz',
    'la paz': 'America/La_Paz',
    'panama': 'America/Panama',
    'cuba': 'America/Havana',
    'habana': 'America/Havana',
    // Europa
    'españa': 'Europe/Madrid',
    'madrid': 'Europe/Madrid',
    'barcelona': 'Europe/Madrid',
    'reino unido': 'Europe/London',
    'londres': 'Europe/London',
    'london': 'Europe/London',
    'francia': 'Europe/Paris',
    'paris': 'Europe/Paris',
    'alemania': 'Europe/Berlin',
    'berlin': 'Europe/Berlin',
    'italia': 'Europe/Rome',
    'roma': 'Europe/Rome',
    'rusia': 'Europe/Moscow',
    'moscu': 'Europe/Moscow',
    'portugal': 'Europe/Lisbon',
    'lisboa': 'Europe/Lisbon',
    'holanda': 'Europe/Amsterdam',
    'amsterdam': 'Europe/Amsterdam',
    'suiza': 'Europe/Zurich',
    'zurich': 'Europe/Zurich',
    'grecia': 'Europe/Athens',
    'atenas': 'Europe/Athens',
    'turquia': 'Europe/Istanbul',
    'estambul': 'Europe/Istanbul',
    'ucrania': 'Europe/Kiev',
    'kiev': 'Europe/Kiev',
    'polonia': 'Europe/Warsaw',
    'varsovia': 'Europe/Warsaw',
    // Asia
    'japon': 'Asia/Tokyo',
    'japan': 'Asia/Tokyo',
    'tokio': 'Asia/Tokyo',
    'tokyo': 'Asia/Tokyo',
    'china': 'Asia/Shanghai',
    'shanghai': 'Asia/Shanghai',
    'beijing': 'Asia/Shanghai',
    'corea del sur': 'Asia/Seoul',
    'seul': 'Asia/Seoul',
    'india': 'Asia/Kolkata',
    'nueva delhi': 'Asia/Kolkata',
    'dubai': 'Asia/Dubai',
    'emiratos': 'Asia/Dubai',
    'singapur': 'Asia/Singapore',
    'tailandia': 'Asia/Bangkok',
    'bangkok': 'Asia/Bangkok',
    'indonesia': 'Asia/Jakarta',
    'jakarta': 'Asia/Jakarta',
    'pakistan': 'Asia/Karachi',
    'karachi': 'Asia/Karachi',
    'israel': 'Asia/Jerusalem',
    'tel aviv': 'Asia/Jerusalem',
    'filipinas': 'Asia/Manila',
    'manila': 'Asia/Manila',
    'vietnam': 'Asia/Ho_Chi_Minh',
    'hong kong': 'Asia/Hong_Kong',
    // África
    'sudafrica': 'Africa/Johannesburg',
    'johannesburgo': 'Africa/Johannesburg',
    'egipto': 'Africa/Cairo',
    'cairo': 'Africa/Cairo',
    'nigeria': 'Africa/Lagos',
    'lagos': 'Africa/Lagos',
    'kenia': 'Africa/Nairobi',
    'nairobi': 'Africa/Nairobi',
    'marruecos': 'Africa/Casablanca',
    'casablanca': 'Africa/Casablanca',
    'ghana': 'Africa/Accra',
    'etiopia': 'Africa/Addis_Ababa',
    // Oceanía
    'australia': 'Australia/Sydney',
    'sydney': 'Australia/Sydney',
    'melbourne': 'Australia/Melbourne',
    'nueva zelanda': 'Pacific/Auckland',
    'auckland': 'Pacific/Auckland',
  };

  private resolveTimezone(input: string): string {
    // Si ya es un formato IANA válido (contiene /) lo usamos directo
    if (input.includes('/')) {
      return input;
    }

    // Normalizamos: minúsculas y sin tildes
    const normalized = input
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    // Buscamos en el mapa
    const timezone = this.timezoneMap[normalized];
    if (timezone) {
      return timezone;
    }

    // Si no encontramos intentamos con el input original
    return input;
  }

  getDatetime(input: string): string {
    try {
      const timezone = this.resolveTimezone(input);
      this.logger.log(`🌍 Timezone resuelto: ${input} → ${timezone}`);

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

      return `📅 Fecha y hora en ${input}:\n${formatted}`;

    } catch {
      return `No encontré la zona horaria para: ${input}.\nIntenta con el nombre del país o ciudad principal.`;
    }
  }
}
