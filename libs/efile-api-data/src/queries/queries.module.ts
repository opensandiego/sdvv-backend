import { Module } from '@nestjs/common';
import { SharedQueryService } from './shared.query.service';
import { ElectionOfficeService } from './election.office.service';
import { RaisedCommitteeService } from './raised.committee.service';
import { CandidateSummaryService } from './candidate.summary.service';

@Module({
  imports: [],
  providers: [
    SharedQueryService,
    ElectionOfficeService,
    RaisedCommitteeService,
    CandidateSummaryService,
  ],
  exports: [
    SharedQueryService,
    ElectionOfficeService,
    RaisedCommitteeService,
    CandidateSummaryService,
  ],
})
export class QueriesModule {}
