import { Injectable, NotFoundException } from '@nestjs/common';
import { SharedQueryService } from '@app/efile-api-data/queries/shared.query.service';
import { CandidateSummaryService } from '@app/efile-api-data/queries/candidate.summary.service';
import { CandidateIndependentExpendituresService } from '@app/efile-api-data/queries/candidate.independent.expenditures.service';
import { CandidateListService } from '@app/efile-api-data/queries/candidate.list.service';
import { CandidateLocationContributionsService } from '@app/efile-api-data/queries/candidate.location.contributions.service';
import { CandidateQuickView } from './interfaces/candidate.quickview';

@Injectable()
export class APICandidateQuickViewService {
  constructor(
    private sharedQueryService: SharedQueryService,
    private candidateSummaryService: CandidateSummaryService,
    private candidateIndependentExpendituresService: CandidateIndependentExpendituresService,
    private candidateListService: CandidateListService,
    private candidateLocationContributionsService: CandidateLocationContributionsService,
  ) {}

  async getCandidateCardExpanded(
    candidateId: string,
  ): Promise<CandidateQuickView> {
    try {
      const candidate = await this.sharedQueryService.getCandidateFromCoeId(
        candidateId,
      );

      const raised = await this.candidateSummaryService.getRaisedSum(
        candidate['candidate_controlled_committee_name'],
      );

      const spent = await this.candidateSummaryService.getSpentSum(
        candidate['candidate_controlled_committee_name'],
      );

      const averageDonation =
        await this.candidateSummaryService.getContributionAvg(
          candidate['candidate_controlled_committee_name'],
        );

      const outside_money = {
        sup: await this.candidateIndependentExpendituresService.support(
          //candidate['candidate_name'],
          candidate['last_name'],
          candidate['election_date'],
        ),
        opp: await this.candidateIndependentExpendituresService.opposed(
          //candidate['candidate_name'],
          candidate['last_name'],
          candidate['election_date'],
        ),
      };
      outside_money['total'] = +outside_money.sup + +outside_money.opp;

      let zipCodes = null;
      if (candidate['district']) {
        zipCodes =
          await this.candidateLocationContributionsService.getDistrictZipCodes(
            candidate['district'],
          );
      } else {
        zipCodes =
          await this.candidateLocationContributionsService.getCityZipCodes();
      }

      const raised_in_out = {
        in: await this.candidateLocationContributionsService.getContributionInZipCodes(
          candidate['candidate_controlled_committee_name'],
          zipCodes,
        ),
        out: await this.candidateLocationContributionsService.getContributionOutZipCodes(
          candidate['candidate_controlled_committee_name'],
          zipCodes,
        ),
      };

      const donations_by_group =
        await this.candidateListService.getContributionByOccupation(
          candidate['candidate_controlled_committee_name'],
          5,
        );

      donations_by_group.forEach((group) => {
        group['average'] = Math.round((group.sum * 100) / raised).toString();
      });

      return {
        id: candidateId,
        raisedVsSpent: {
          id: candidateId,
          raised: raised,
          spent: spent,
          averageDonation: averageDonation,
        },
        donationsByGroupData: {
          id: candidateId,
          groups: donations_by_group,
        },
        raisedInOut: {
          id: candidateId,
          inside: raised_in_out.in,
          outside: raised_in_out.out,
          areaName: candidate.agency,
          jurisdiction: candidate.district
            ? 'District'
            : candidate.jurisdiction_type,
          jurisdictionSuffix: candidate.district,
        },
        outsideMoney: {
          id: candidateId,
          support: outside_money.sup,
          oppose: outside_money.opp,
          // scale: 1,
        },
      };
    } catch (error) {
      console.log('Error in: getCandidateCardExpanded');
      throw new NotFoundException();
    }
  }
}
