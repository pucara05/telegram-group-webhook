import { Module } from '@nestjs/common';
import { ToolsService } from './tools.service';
import { WeatherService } from './weather/weather.service';
import { DatetimeService } from './datetime/datetime.service';

@Module({
  providers: [ToolsService, WeatherService, DatetimeService],
  exports: [ToolsService],
})
export class ToolsModule {}