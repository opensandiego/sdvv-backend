import { Controller, Get, Param } from '@nestjs/common';
import { ChartDataService } from './chart.data.service';

@Controller('chart-data')
export class ChartDataController {
  constructor(private chartDataService: ChartDataService) {}

  @Get('raised-spent/id/:coe_id')
  async raisedSpentCandidateId(@Param('coe_id') id: string) {
    return await this.chartDataService.getRaisedSpentId(id);
  }
}
