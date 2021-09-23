import { Module } from '@nestjs/common';
import { ChartDataController } from './chart.data.controller';
import { ChartDataService } from './chart.data.service';
import { SharedCalculateService } from './calculations/shared.calculate.service';
import { RaisedSpentService } from './calculations/raised.spent.service';
import { OutsideSpendingService } from './calculations/outside.spending.service';
import { ContributionsService } from './calculations/contributions.service';
import { ContributionsMethodService } from './calculations/contributions.method.service';
import { ContributionsDemographicService } from './calculations/contributions.demographic.service';

@Module({
  imports: [],
  providers: [
    ChartDataService,
    SharedCalculateService,
    RaisedSpentService,
    OutsideSpendingService,
    ContributionsService,
    ContributionsMethodService,
    ContributionsDemographicService,
  ],
  controllers: [ChartDataController],
})
export class ChartDataModule {}
