import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { CalculateChartDataService } from './calculate.chart.data.service';
import { RaisedSpentService } from './calculations/raised.spent.service';
import { SharedCalculateService } from './calculations/shared.calculate.service';

@Injectable()
export class ChartDataService {
  constructor(
    private connection: Connection,
    private calculateChartDataService: CalculateChartDataService,
    private sharedService: SharedCalculateService,
    private raisedSpentService: RaisedSpentService,
  ) {}

  async getRaisedSpentId(id: string) {
    try {
      const filerName = await this.sharedService.getFilerNameFromCoeId(id);

      const { raisedSum, spentSum } =
        await this.raisedSpentService.getRaisedAndSpent(filerName);

      return { raisedSum, spentSum, filerName, coe_id: id };
    } catch (error) {
      console.log('Error getting Raised and Spent');
      return { error: 'Error getting Raised and Spent' };
    }
  }
}
