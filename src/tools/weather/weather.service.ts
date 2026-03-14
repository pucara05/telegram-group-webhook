import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WeatherService {
    private readonly logger = new Logger(WeatherService.name);

    async getWeather(city: string): Promise<string> {
        try {
            // Paso 1 — Buscar coordenadas de cualquier ciudad del mundo
            const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=es`;
            const geoResponse = await axios.get(geoUrl);

            if (!geoResponse.data.results?.length) {
                return `No encontré la ciudad: ${city}. Intenta con el nombre en español o inglés.`;
            }

            const location = geoResponse.data.results[0];
            const { latitude, longitude, name, country } = location;

            // Paso 2 — Obtener el clima con las coordenadas reales
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode,windspeed_10m&timezone=auto`;
            const weatherResponse = await axios.get(weatherUrl);
            const current = weatherResponse.data.current;

            const condition = this.getCondition(current.weathercode);

            return `🌤️ Clima en ${name}, ${country}:\n` +
                `🌡️ Temperatura: ${current.temperature_2m}°C\n` +
                `☁️ Condición: ${condition}\n` +
                `💨 Viento: ${current.windspeed_10m} km/h`;

        } catch (error) {
            this.logger.error('Error obteniendo clima', error);
            return 'No pude obtener el clima en este momento';
        }
    }

    private getCondition(code: number): string {
        if (code === 0) return 'Despejado ☀️';
        if (code <= 3) return 'Parcialmente nublado ⛅';
        if (code <= 48) return 'Nublado ☁️';
        if (code <= 67) return 'Lluvia 🌧️';
        if (code <= 77) return 'Nieve 🌨️';
        if (code <= 82) return 'Lluvia fuerte 🌧️';
        if (code <= 99) return 'Tormenta ⛈️';
        return 'Desconocido';
    }
}