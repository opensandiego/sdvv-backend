import { Module } from '@nestjs/common';
import { CandidateCommitteeService } from './candidate.committee.service';
import { CandidateYearService } from './candidates.year.service';
import { TransactionCommitteeService } from './transaction-committee.service';
import { DeduplicateExpendituresService } from './deduplicate-expenditures.service';

@Module({
  imports: [],
  providers: [
    CandidateCommitteeService,
    TransactionCommitteeService,
    CandidateYearService,
    DeduplicateExpendituresService,
  ],
  exports: [
    CandidateCommitteeService,
    CandidateYearService,
    DeduplicateExpendituresService,
  ],
})
export class ProcessDataModule {}
