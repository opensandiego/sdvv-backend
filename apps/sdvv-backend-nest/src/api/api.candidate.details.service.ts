import { Injectable, NotFoundException } from '@nestjs/common';
import { SharedQueryService } from '@app/efile-api-data/queries/shared.query.service';
import { CandidateSummaryService } from '@app/efile-api-data/queries/candidate.summary.service';
import { CandidateIndependentExpendituresService } from '@app/efile-api-data/queries/candidate.independent.expenditures.service';
import { CandidateListService } from '@app/efile-api-data/queries/candidate.list.service';
import { CandidateLocationContributionsService } from '@app/efile-api-data/queries/candidate.location.contributions.service';
import { CandidateDetailsRaisedSpent } from './interfaces/candidate.details.raised.spent';
import { CandidateDetailsHeader } from './interfaces/candidate.details.header';
import { CandidateDetailsRaisedByGroup } from './interfaces/candidate.details.raised.group';
import { CandidateDetailsRaisedByLocation } from './interfaces/candidate.details.raised.location';
import { CandidateDetailsOutsideMoney } from './interfaces/candidate.details.outside.money';

@Injectable()
export class APICandidateDetailsService {
  constructor(
    private sharedQueryService: SharedQueryService,
    private candidateSummaryService: CandidateSummaryService,
    private candidateIndependentExpendituresService: CandidateIndependentExpendituresService,
    private candidateListService: CandidateListService,
    private candidateLocationContributionsService: CandidateLocationContributionsService,
  ) {}

  async getCandidateDetailsHeader(
    candidateId: string,
  ): Promise<CandidateDetailsHeader> {
    try {
      const candidate = await this.sharedQueryService.getCandidateFromId(
        candidateId,
      );

      return {
        id: candidate['candidate_id'],
        candidateName: candidate['candidate_name'],
        raised: await this.candidateSummaryService.getRaisedSum(
          candidate['candidate_controlled_committee_name'],
        ),
        donors: await this.candidateSummaryService.getContributionCount(
          candidate['candidate_controlled_committee_name'],
        ),
        averageDonation: await this.candidateSummaryService.getContributionAvg(
          candidate['candidate_controlled_committee_name'],
        ),
        imageUrl: candidate['imageURL'],
        website: candidate['website'],
        description: candidate['description'],
      };
    } catch (error) {
      console.log('Error in: getCandidateDetailsHeader');
      throw new NotFoundException();
    }
  }

  async getCandidateDetailsRaisedSpent(
    candidateId: string,
  ): Promise<CandidateDetailsRaisedSpent> {
    try {
      const candidate = await this.sharedQueryService.getCandidateFromId(
        candidateId,
      );

      const raised = await this.candidateSummaryService.getRaisedSum(
        candidate['candidate_controlled_committee_name'],
      );

      const spent = await this.candidateSummaryService.getSpentSum(
        candidate['candidate_controlled_committee_name'],
      );

      return {
        id: candidate['candidate_id'],
        // name: candidate['candidate_name'],
        // committee_name: candidate['candidate_controlled_committee_name'],
        summary: {
          totalRaised: raised,
          totalSpent: spent,
          balance: (+raised - +spent).toString(),
        },
        cashOnHand: '-1', // How should this amount be determined?
        loansAndDebts: '-1', // How should this amount be determined?
        raisedGroups: [
          {
            name: 'In Kind',
            amount: await this.candidateSummaryService.getRaisedInKindSum(
              candidate['candidate_controlled_committee_name'],
            ),
          },
          {
            name: 'Individual',
            amount: await this.candidateSummaryService.getRaisedIndividualSum(
              candidate['candidate_controlled_committee_name'],
            ),
          },
          {
            name: 'Other',
            amount: await this.candidateSummaryService.getRaisedOtherSum(
              candidate['candidate_controlled_committee_name'],
            ),
          },
        ],

        spentGroup: await this.candidateListService.getExpenseBySpendingCode(
          candidate['candidate_controlled_committee_name'],
          5,
        ),
      };
    } catch (error) {
      console.log('Error in: getCandidateDetailsRaisedSpent');
      throw new NotFoundException();
    }
  }

  async getCandidateDetailsRaisedByIndustry(
    candidateId: string,
  ): Promise<CandidateDetailsRaisedByGroup> {
    try {
      const candidate = await this.sharedQueryService.getCandidateFromId(
        candidateId,
      );
      return {
        id: candidate['candidate_id'],
        // name: candidate['candidate_name'],
        // committee_name: candidate['candidate_controlled_committee_name'],
        occupations:
          await this.candidateListService.getContributionByOccupation(
            candidate['candidate_controlled_committee_name'],
          ),
        employers: await this.candidateListService.getContributionByEmployer(
          candidate['candidate_controlled_committee_name'],
        ),
        // by_name: await this.candidateListService.getContributionByName(
        //   candidate['candidate_controlled_committee_name'],
        // ),
      };
    } catch (error) {
      console.log('Error in: getCandidateDetailsRaisedByIndustry');
      throw new NotFoundException();
    }
  }

  async getCandidateDetailsRaisedByLocation(
    candidateId: string,
  ): Promise<CandidateDetailsRaisedByLocation> {
    try {
      const candidate = await this.sharedQueryService.getCandidateFromId(
        candidateId,
      );

      let districtContributionSum = null;
      if (candidate['district']) {
        const districtZipCodes =
          await this.candidateLocationContributionsService.getDistrictZipCodes(
            candidate['district'],
          );
        districtContributionSum =
          await this.candidateLocationContributionsService.getContributionInZipCodes(
            candidate['candidate_controlled_committee_name'],
            districtZipCodes,
          );
      }

      const cityZipCodes =
        await this.candidateLocationContributionsService.getCityZipCodes();
      const cityContributionSum =
        await this.candidateLocationContributionsService.getContributionInZipCodes(
          candidate['candidate_controlled_committee_name'],
          cityZipCodes,
        );

      const countyZipCodes =
        await this.candidateLocationContributionsService.getCountyZipCodes();
      const countyContributionSum =
        await this.candidateLocationContributionsService.getContributionInZipCodes(
          candidate['candidate_controlled_committee_name'],
          countyZipCodes,
        );

      const stateZipCodes =
        await this.candidateLocationContributionsService.getStateZipCodes();
      const stateContributionSum =
        await this.candidateLocationContributionsService.getContributionInZipCodes(
          candidate['candidate_controlled_committee_name'],
          stateZipCodes,
        );

      const nonStateContributionSum =
        await this.candidateLocationContributionsService.getContributionOutZipCodes(
          candidate['candidate_controlled_committee_name'],
          stateZipCodes,
        );

      return {
        id: candidate['candidate_id'],
        // name: candidate['candidate_name'],
        // committee_name: candidate['candidate_controlled_committee_name'],
        locations: [
          {
            name: 'In District',
            amount: districtContributionSum,
          },
          {
            name: 'In City',
            amount: cityContributionSum,
          },
          {
            name: 'In County',
            amount: countyContributionSum,
          },
          {
            name: 'In State',
            amount: stateContributionSum,
          },
          {
            name: 'Out of State',
            amount: nonStateContributionSum,
          },
        ],
      };
    } catch (error) {
      console.log('Error in: getCandidateDetailsRaisedByLocation');
      throw new NotFoundException();
    }
  }

  async getCandidateDetailsOutsideMoney(
    candidateId: string,
  ): Promise<CandidateDetailsOutsideMoney> {
    try {
      const candidate = await this.sharedQueryService.getCandidateFromId(
        candidateId,
      );

      return {
        id: candidate['candidate_id'],
        // name: candidate['candidate_name'],
        // committee_name: candidate['candidate_controlled_committee_name'],
        supportGroups:
          await this.candidateIndependentExpendituresService.supportList(
            candidate['last_name'],
            `12/31/${candidate['election_year']}`,
            5,
          ),
        oppositionGroups:
          await this.candidateIndependentExpendituresService.opposeList(
            candidate['last_name'],
            `12/31/${candidate['election_year']}`,
            5,
          ),
      };
    } catch (error) {
      console.log('Error in: getCandidateDetailsOutsideMoney');
      throw new NotFoundException();
    }
  }
}
