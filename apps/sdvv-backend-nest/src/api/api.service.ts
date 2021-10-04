import { Injectable } from '@nestjs/common';
import { SharedQueryService } from '@app/efile-api-data/queries/shared.query.service';
import { ElectionOfficeService } from '@app/efile-api-data/queries/election.office.service';
import { RaisedCommitteeService } from '@app/efile-api-data/queries/raised.committee.service';
import { CandidateSummaryService } from '@app/efile-api-data/queries/candidate.summary.service';
import { CandidateIndependentExpendituresService } from '@app/efile-api-data/queries/candidate.independent.expenditures.service';
import { CandidateListService } from '@app/efile-api-data/queries/candidate.list.service';
import { CandidateLocationContributionsService } from '@app/efile-api-data/queries/candidate.location.contributions.service';

@Injectable()
export class APIService {
  constructor(
    private sharedQueryService: SharedQueryService,
    private electionOfficeService: ElectionOfficeService,
    private raisedCommitteeService: RaisedCommitteeService,
    private candidateSummaryService: CandidateSummaryService,
    private candidateIndependentExpendituresService: CandidateIndependentExpendituresService,
    private candidateListService: CandidateListService,
    private candidateLocationContributionsService: CandidateLocationContributionsService,
  ) {}

  async getOfficesSummary(electionId: string) {
    try {
      const offices = await this.electionOfficeService.getOffices(electionId);

      for await (const office of offices) {
        const total = await this.raisedCommitteeService.getRaisedByCommittees(
          office['committee_names'],
        );
        office.totalRaised = total;
        delete office.committee_names;
      }

      return offices;
    } catch (error) {
      console.log('Error in getOfficesSummary');
      return { error: 'Error getting summary of offices.' };
    }
  }

  async getCandidateCard(candidateId: string) {
    try {
      const candidate = await this.sharedQueryService.getCandidateFromCoeId(
        candidateId,
      );

      const raised = await this.candidateSummaryService.getRaisedSum(
        candidate['candidate_controlled_committee_name'],
      );

      const donorsCount =
        await this.candidateSummaryService.getContributionCount(
          candidate['candidate_controlled_committee_name'],
        );

      return {
        name: candidate['candidate_name'],
        raised: raised,
        donors: donorsCount,
        candidateId,
      };
    } catch (error) {
      console.log('Error in: getCandidateCard');
      return { error: 'Error getting amounts for the candidate card' };
    }
  }

  async getCandidateCardExpanded(candidateId: string) {
    
  }
}
