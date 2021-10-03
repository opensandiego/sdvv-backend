import { Module } from '@nestjs/common';
import { SharedQueryService } from './shared.query.service';
import { ElectionOfficeService } from './election.office.service';
import { RaisedCommitteeService } from './raised.committee.service';
import { CandidateSummaryService } from './candidate.summary.service';
import { CandidateIndependentExpendituresService } from './candidate.independent.expenditures.service';
import { CandidateListService } from './candidate.list.service';

@Module({
  imports: [],
  providers: [
    SharedQueryService,
    ElectionOfficeService,
    RaisedCommitteeService,
    CandidateSummaryService,
    CandidateIndependentExpendituresService,
    CandidateListService,
  ],
  exports: [
    SharedQueryService,
    ElectionOfficeService,
    RaisedCommitteeService,
    CandidateSummaryService,
    CandidateIndependentExpendituresService,
    CandidateListService,
  ],
})
export class QueriesModule {}
