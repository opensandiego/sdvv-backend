import { Injectable, NotFoundException } from '@nestjs/common';
import { SharedQueryService } from '@app/efile-api-data/queries/shared.query.service';
import { ElectionOfficeService } from '@app/efile-api-data/queries/election.office.service';
import { RaisedCommitteeService } from '@app/efile-api-data/queries/raised.committee.service';
import { CandidateSummaryService } from '@app/efile-api-data/queries/candidate.summary.service';
import { CandidateIndependentExpendituresService } from '@app/efile-api-data/queries/candidate.independent.expenditures.service';
import { CandidateListService } from '@app/efile-api-data/queries/candidate.list.service';
import { CandidateLocationContributionsService } from '@app/efile-api-data/queries/candidate.location.contributions.service';
import { OfficeSummary } from './interfaces/office.summary';

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

  async getOfficesSummary(electionId: string): Promise<OfficeSummary[]> {
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
      throw new NotFoundException();
    }
  }

  async getCandidateCardExpanded(candidateId: string) {
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
        candidateId,
        name: candidate['candidate_name'],
        last_name: candidate['last_name'],
        committee_name: candidate['candidate_controlled_committee_name'],
        raised: raised,
        spent: spent,
        average_donation: averageDonation.toString(),
        raised_in_out,
        outside_money,
        donations_by_group,
      };
    } catch (error) {
      console.log('Error in: getCandidateCardExpanded');
      return { error: 'Error getting amounts for the candidate expanded card' };
    }
  }

  async getCandidateDetailsHeader(candidateId: string) {
    try {
      const candidate = await this.sharedQueryService.getCandidateFromCoeId(
        candidateId,
      );

      return {
        candidateId,
        name: candidate['candidate_name'],
        committee_name: candidate['candidate_controlled_committee_name'],
        raised: await this.candidateSummaryService.getRaisedSum(
          candidate['candidate_controlled_committee_name'],
        ),
        donors: await this.candidateSummaryService.getContributionCount(
          candidate['candidate_controlled_committee_name'],
        ),
        average_donation: await this.candidateSummaryService.getContributionAvg(
          candidate['candidate_controlled_committee_name'],
        ),
      };
    } catch (error) {
      console.log('Error in: getCandidateDetailsHeader');
      return {
        error: 'Error getting amounts for the candidate details header',
      };
    }
  }

  async getCandidateDetailsRaisedSpent(candidateId: string) {
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

      return {
        candidateId,
        name: candidate['candidate_name'],
        committee_name: candidate['candidate_controlled_committee_name'],
        summary: {
          total_raised: raised,
          total_spent: spent,
          balance: +raised - +spent,
        },
        cash_on_hand: '-1', // How should this amount be determined?
        loans_and_debts: '-1', // How should this amount be determined?
        raised_groups: [
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

        spent_groups: await this.candidateListService.getExpenseBySpendingCode(
          candidate['candidate_controlled_committee_name'],
          5,
        ),
      };
    } catch (error) {
      console.log('Error in: getCandidateDetailsRaisedSpent');
      return {
        error:
          'Error getting amounts for the candidate details raised vs. spent',
      };
    }
  }

  async getCandidateDetailsRaisedByIndustry(candidateId: string) {
    try {
      const candidate = await this.sharedQueryService.getCandidateFromCoeId(
        candidateId,
      );
      return {
        candidateId,
        name: candidate['candidate_name'],
        committee_name: candidate['candidate_controlled_committee_name'],
        by_occupation:
          await this.candidateListService.getContributionByOccupation(
            candidate['candidate_controlled_committee_name'],
          ),
        by_employer: await this.candidateListService.getContributionByEmployer(
          candidate['candidate_controlled_committee_name'],
        ),
        // by_name: await this.candidateListService.getContributionByName(
        //   candidate['candidate_controlled_committee_name'],
        // ),
      };
    } catch (error) {
      console.log('Error in: getCandidateDetailsRaisedByIndustry');
      return {
        error:
          'Error getting amounts for the candidate details raised by industry',
      };
    }
  }

  async getCandidateDetailsRaisedByLocation(candidateId: string) {
    try {
      const candidate = await this.sharedQueryService.getCandidateFromCoeId(
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
        candidateId,
        name: candidate['candidate_name'],
        committee_name: candidate['candidate_controlled_committee_name'],
        contributionByLocation: [
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
      return {
        error:
          'Error getting amounts for the candidate details raised by location',
      };
    }
  }

  async getCandidateDetailsOutsideMoney(candidateId: string) {
    try {
      const candidate = await this.sharedQueryService.getCandidateFromCoeId(
        candidateId,
      );

      return {
        candidateId,
        name: candidate['candidate_name'],
        committee_name: candidate['candidate_controlled_committee_name'],
        support_groups:
          await this.candidateIndependentExpendituresService.supportList(
            candidate['last_name'],
            candidate['election_date'],
            5,
          ),
        opposed_groups:
          await this.candidateIndependentExpendituresService.opposeList(
            candidate['last_name'],
            candidate['election_date'],
            5,
          ),
      };
    } catch (error) {
      console.log('Error in: getCandidateDetailsOutsideMoney');
      return {
        error: 'Error getting amounts for the candidate details outside money',
      };
    }
  }
}
