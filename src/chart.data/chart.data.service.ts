import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { ContributionsService } from './calculations/contributions.service';
import { RaisedSpentService } from './calculations/raised.spent.service';
import { SharedCalculateService } from './calculations/shared.calculate.service';

@Injectable()
export class ChartDataService {
  constructor(
    private connection: Connection,
    private sharedService: SharedCalculateService,
    private raisedSpentService: RaisedSpentService,
    private contributionsService: ContributionsService,
  ) {}

  async getRaisedSpentId(id: string) {
    try {
      const filerName = await this.sharedService.getFilerNameFromCoeId(id);

      const { raisedSum, spentSum } =
        await this.raisedSpentService.getRaisedAndSpent(filerName);

      return { raisedSum, spentSum, filerName, coe_id: id };
    } catch (error) {
      console.log('Error getting Raised and Spent');
      return { error: 'Error getting Raised and Spent' };
    }
  }

  async candidateCard(id: string) {
    try {
      const filerName = await this.sharedService.getFilerNameFromCoeId(id);

      const average = await this.contributionsService.getContributionAvg(
        filerName,
      );

      const count = await this.contributionsService.getContributionCount(
        filerName,
      );

      const limit = 10000;

      const listByOccupation =
        await this.contributionsService.getContributionByOccupation(
          filerName,
          limit,
        );

      const listByEmployer =
        await this.contributionsService.getContributionByEmployer(
          filerName,
          limit,
        );

      const listByName = await this.contributionsService.getContributionByName(
        filerName,
        5,
      );

      const listByIntrName =
        await this.contributionsService.getContributionByIntrName(
          filerName,
          limit,
        );

      console.log('listByOccupation.length', listByOccupation.length);
      console.log('listByEmployer.length', listByEmployer.length);
      console.log('listByName.length', listByName.length);
      console.log('listByIntrName.length', listByIntrName.length);

      return {
        average,
        count,
        filerName,
        coe_id: id,
        listByOccupation,
        listByEmployer,
        listByName,
        listByIntrName,
      };
    } catch (error) {
      console.log('Error getting candidateCard');
      return { error: 'Error getting candidateCard' };
    }
  }

  async candidateOffice(electionId: string) {
    try {
      const candidates = await this.contributionsService.getCandidateCount(
        electionId,
      );
      return { candidates };
    } catch (error) {
      console.log('Error getting candidateOffice');
      return { error: 'Error getting candidateOffice' };
    }
  }
}
