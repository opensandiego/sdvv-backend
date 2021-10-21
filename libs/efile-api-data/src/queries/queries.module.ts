import { Module } from '@nestjs/common';
import { SharedQueryService } from './shared.query.service';
import { ElectionOfficeService } from './election.office.service';
import { RaisedCommitteeService } from './raised.committee.service';
import { CandidateSummaryService } from './candidate.summary.service';
import { CandidateIndependentExpendituresService } from './candidate.independent.expenditures.service';
import { CandidateListService } from './candidate.list.service';
import { CandidateLocationContributionsService } from './candidate.location.contributions.service';
import { CandidateNavigationService } from './candidate.navigation.service';
import { CandidateService } from './candidate.service';

@Module({
  imports: [],
  providers: [
    SharedQueryService,
    ElectionOfficeService,
    RaisedCommitteeService,
    CandidateSummaryService,
    CandidateIndependentExpendituresService,
    CandidateListService,
    CandidateLocationContributionsService,
    CandidateNavigationService,
    CandidateService,
  ],
  exports: [
    SharedQueryService,
    ElectionOfficeService,
    RaisedCommitteeService,
    CandidateSummaryService,
    CandidateIndependentExpendituresService,
    CandidateListService,
    CandidateLocationContributionsService,
    CandidateNavigationService,
    CandidateService,
  ],
})
export class QueriesModule {}
