import { Module } from '@nestjs/common';
import { ContributorSummaryResolver } from './contributor-summary.resolver';
import { ContributorService } from './contributor.service';

@Module({
  imports: [],
  providers: [ContributorSummaryResolver, ContributorService],
  exports: [ContributorService],
})
export class ContributorsModule {}
