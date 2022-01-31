import { Module } from '@nestjs/common';
import { CandidateModule } from '../candidate/candidate.module';
import { ElectionYearResolver } from './election-year.resolver';
import { ElectionYearsService } from './election-years.service';
import { ElectionService } from './election/election.service';
import { ElectionYearParams } from './election-year.validator';

@Module({
  imports: [CandidateModule],
  providers: [
    ElectionYearResolver,
    ElectionYearsService,
    ElectionService,
    ElectionYearParams,
  ],
  exports: [],
})
export class ElectionYearsModule {}
