import { Injectable, NotFoundException } from '@nestjs/common';
import { SharedQueryService } from '@app/efile-api-data/queries/shared.query.service';
import { CandidateSummaryService } from '@app/efile-api-data/queries/candidate.summary.service';
import { CandidateCard } from './interfaces/candidate.card';

@Injectable()
export class APICandidateCardService {
  constructor(
    private sharedQueryService: SharedQueryService,
    private candidateSummaryService: CandidateSummaryService,
  ) {}

  async getCandidateCard(candidateId: string): Promise<CandidateCard> {
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
        id: candidateId,
        name: candidate['candidate_name'],
        description: '',
        // committee_name: candidate['candidate_controlled_committee_name'],
        raised: raised,
        donors: donorsCount,
        candidateImgURL: '',
        website: '',
      };
    } catch (error) {
      console.log('Error in: getCandidateCard');
      throw new NotFoundException();
    }
  }
}