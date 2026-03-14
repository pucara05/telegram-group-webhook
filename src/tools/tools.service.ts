import { Injectable } from '@nestjs/common';
import { WeatherService } from './weather/weather.service';
import { DatetimeService } from './datetime/datetime.service';

@Injectable()
export class ToolsService {
  constructor(
    private readonly weatherService: WeatherService,
    private readonly datetimeService: DatetimeService,
  ) {}

  getToolDefinitions() {
    return [
      {
        type: 'function',
        function: {
          name: 'get_weather',
          description: 'Obtiene el clima actual de cualquier ciudad del mundo',
          parameters: {
            type: 'object',
            properties: {
              city: {
                type: 'string',
                description: 'Nombre de la ciudad, ejemplo: Bogotá, Lima, Tokyo',
              },
            },
            required: ['city'],
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'get_datetime',
          description: 'Obtiene la fecha y hora actual de cualquier país o ciudad del mundo',
          parameters: {
            type: 'object',
            properties: {
              timezone: {
                type: 'string',
                description: 'Zona horaria IANA. Ejemplos: America/Bogota, America/Lima, Asia/Tokyo, Europe/Madrid, America/Mexico_City',
              },
            },
            required: ['timezone'],
          },
        },
      },
    ];
  }

  async executeTool(toolName: string, args: any): Promise<string> {
    switch (toolName) {
      case 'get_weather':
        return this.weatherService.getWeather(args.city);
      case 'get_datetime':
        return this.datetimeService.getDatetime(args.timezone);
      default:
        return `Herramienta desconocida: ${toolName}`;
    }
  }
}