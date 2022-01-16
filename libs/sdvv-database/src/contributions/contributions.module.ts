import { Module } from '@nestjs/common';
import { ContributionsResolver } from './contributions.resolver';
import { ContributionsService } from './contributions.service';

@Module({
  imports: [],
  providers: [ContributionsService, ContributionsResolver],
  exports: [ContributionsService],
})
export class ContributionsModule {}
