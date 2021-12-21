import { Module } from '@nestjs/common';
import { CandidateCommitteeService } from './candidate.committee.service';
import { CandidateYearService } from './candidates.year.service';

@Module({
  imports: [],
  providers: [CandidateCommitteeService, CandidateYearService],
  exports: [CandidateCommitteeService, CandidateYearService],
})
export class ProcessDataModule {}
