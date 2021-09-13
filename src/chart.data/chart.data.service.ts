import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { CalculateChartDataService } from './calculate.chart.data.service';

@Injectable()
export class ChartDataService {
  constructor(
    private connection: Connection,
    private calculateChartDataService: CalculateChartDataService,
  ) {}

  async getRaisedSpentId(id: string) {
    try {
      const filerName =
        await this.calculateChartDataService.getFilerNameFromCoeId(id);

      const { raisedSum, spentSum } =
        await this.calculateChartDataService.getRaisedAndSpentFromName(
          filerName,
        );

      return { raisedSum, spentSum, filerName, coe_id: id };
    } catch (error) {
      console.log('Error getting Raised and Spent');
      return { error: 'Error getting Raised and Spent' };
    }
  }
}
