import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { CalculateChartDataService } from './calculate.chart.data.service';

@Injectable()
export class ChartDataService {
  constructor(
    private connection: Connection,
    private calculateChartDataService: CalculateChartDataService,
  ) {}
}
