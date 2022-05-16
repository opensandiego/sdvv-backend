import { Module } from '@nestjs/common';
import { CandidateCommitteeService } from './candidate.committee.service';
import { CandidateYearService } from './candidates.year.service';
import { TransactionCommitteeService } from './transaction-committee.service';

@Module({
  imports: [],
  providers: [
    CandidateCommitteeService,
    TransactionCommitteeService,
    CandidateYearService,
  ],
  exports: [CandidateCommitteeService, CandidateYearService],
})
export class ProcessDataModule {}
