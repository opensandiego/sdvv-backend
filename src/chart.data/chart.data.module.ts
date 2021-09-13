import { Module } from '@nestjs/common';
import { ChartDataController } from './chart.data.controller';
import { ChartDataService } from './chart.data.service';
import { CalculateChartDataService } from './calculate.chart.data.service';

@Module({
  imports: [],
  providers: [ChartDataService, CalculateChartDataService],
  controllers: [ChartDataController],
})
export class ChartDataModule {}
