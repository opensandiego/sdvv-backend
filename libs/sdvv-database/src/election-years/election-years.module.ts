import { Module } from '@nestjs/common';
import { CandidateModule } from '../candidate/candidate.module';
import { ElectionYearsResolver } from './election-years.resolver';
import { ElectionYearsService } from './election-years.service';
import { ElectionService } from './election/election.service';
import { ElectionYearParams } from './election-year.validator';

@Module({
  imports: [CandidateModule],
  providers: [
    ElectionYearsResolver,
    ElectionYearsService,
    ElectionService,
    ElectionYearParams,
  ],
  exports: [],
})
export class ElectionYearsModule {}
