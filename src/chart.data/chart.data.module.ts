import { Module } from '@nestjs/common';
import { ChartDataController } from './chart.data.controller';
import { ChartDataService } from './chart.data.service';
import { CalculateChartDataService } from './calculate.chart.data.service';
import { SharedCalculateService } from './calculations/shared.calculate.service';
import { RaisedSpentService } from './calculations/raised.spent.service';

@Module({
  imports: [],
  providers: [
    ChartDataService,
    CalculateChartDataService,
    SharedCalculateService,
    RaisedSpentService,
  ],
  controllers: [ChartDataController],
})
export class ChartDataModule {}
