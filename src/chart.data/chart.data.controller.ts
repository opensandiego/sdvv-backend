import { Controller, Get, Param } from '@nestjs/common';
import { ChartDataService } from './chart.data.service';

@Controller('chart-data')
export class ChartDataController {
  constructor(private chartDataService: ChartDataService) {}
}
