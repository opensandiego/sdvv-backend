import { Module } from '@nestjs/common';
import { ContributionsResolver } from './contributions.resolver';
import { ContributionsService } from './contributions.service';
import { ContributorsListService } from './contributors-list.service';

@Module({
  imports: [],
  providers: [
    ContributionsService,
    ContributorsListService,
    ContributionsResolver,
  ],
  exports: [ContributionsService],
})
export class ContributionsModule {}
