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

  async getCandidateCards(options: {
    year: string;
    office: string;
    district: string;
  }): Promise<CandidateCard[]> {
    const candidateIds = await this.sharedQueryService.getCandidatesIds(
      options,
    );
    const ids = candidateIds.map((id) => id.candidate_id);

    const cards = [];
    for await (const id of ids) {
      cards.push(await this.getCandidateCard(id));
    }
    return cards;
  }

  async getCandidateCard(candidateId: string): Promise<CandidateCard> {
    try {
      const candidate = await this.sharedQueryService.getCandidateFromId(
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
        id: candidate['candidate_id'],
        name: candidate['candidate_name'],
        description: candidate['description'],
        // committee_name: candidate['candidate_controlled_committee_name'],
        year: candidate['election_year'],
        office: candidate['office'],
        district: candidate['district'],
        raised: raised,
        donors: donorsCount,
        candidateImgURL: candidate['image_url'],
        website: candidate['website'],
      };
    } catch (error) {
      console.log('Error in: getCandidateCard');
      throw new NotFoundException();
    }
  }
}
