import { Module } from '@nestjs/common';
import { ContributionsSummaryResolver } from './contributions-summary.resolver';
import { ContributionsSummaryService } from './contributions-summary.service';
import { ContributorsListService } from './contributors-list.service';

@Module({
  imports: [],
  providers: [
    ContributionsSummaryService,
    ContributorsListService,
    ContributionsSummaryResolver,
  ],
  exports: [ContributionsSummaryService],
})
export class ContributionsSummaryModule {}
