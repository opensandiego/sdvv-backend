import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { CalculationTransaction } from '../tables/entity/calculation.transactions.entity';
import { CandidateSummaryService } from './candidate.summary.service';

@Injectable()
export class CandidateListService {
  constructor(
    private connection: Connection,
    private candidateSummaryService: CandidateSummaryService,
  ) {}

  async getContributionByOccupation(filerName: string, limit = 20) {
    const groups = await this.connection
      .getRepository(CalculationTransaction)
      .createQueryBuilder()
      .select('occupation')
      .where('filer_name = :filerName', { filerName: filerName })
      .addSelect('SUM(amount)', 'sum')
      .addSelect('COUNT( DISTINCT name)', 'uniqueContributorCount')
      .andWhere('schedule IN (:...schedules)', { schedules: ['A', 'C', 'I'] })
      .andWhere('occupation NOT IN (:...excludedOccupations)', {
        excludedOccupations: ['N/A'],
      })
      .groupBy('occupation')
      .orderBy('sum', 'DESC')
      .limit(limit)
      .getRawMany();

    return groups;
  }

  async getContributionByEmployer(filerName: string, limit = 20) {
    const groups = await this.connection
      .getRepository(CalculationTransaction)
      .createQueryBuilder()
      .select('employer')
      .addSelect('SUM(amount)', 'sum')
      .addSelect('COUNT( DISTINCT name)', 'uniqueContributorCount')
      .where('filer_name = :filerName', { filerName: filerName })
      .andWhere('schedule IN (:...schedules)', { schedules: ['A', 'C', 'I'] })
      .andWhere('(employer IS NOT NULL)')
      .andWhere('employer NOT IN (:...excluded)', {
        excluded: ['N/A', 'n/a', 'None'],
      })
      .groupBy('employer')
      .orderBy('sum', 'DESC')
      .limit(limit)
      .getRawMany();

    return groups;
  }

  async getContributionByName(filerName: string, limit = 20) {
    const groups = await this.connection
      .getRepository(CalculationTransaction)
      .createQueryBuilder()
      .select('name')
      .addSelect('SUM(amount)', 'sum')
      .andWhere('filer_name = :filerName', { filerName: filerName })
      .andWhere('schedule IN (:...schedules)', { schedules: ['A', 'C', 'I'] })
      .groupBy('name')
      .orderBy('sum', 'DESC')
      .limit(limit)
      .getRawMany();

    return groups;
  }

  async getContributionByIntrName(filerName: string, limit = 20) {
    const groups = await this.connection
      .getRepository(CalculationTransaction)
      .createQueryBuilder()
      .select('intr_name')
      .addSelect('SUM(amount)', 'sum')
      // .addSelect('COUNT( DISTINCT name)', 'uniqueContributorCount')
      .andWhere('filer_name = :filerName', { filerName: filerName })
      .andWhere('schedule IN (:...schedules)', { schedules: ['A', 'C', 'I'] })
      .groupBy('intr_name')
      .orderBy('sum', 'DESC')
      .limit(limit)
      .getRawMany();

    return groups;
  }

  // CandidateSpendingListService
  async getExpenseBySpendingCode(filerName: string, limit = 20) {
    // const spent = await this.candidateSummaryService.getSpentSum(filerName);

    const groups = await this.connection
      .getRepository(CalculationTransaction)
      .createQueryBuilder()
      .select('spending_code')
      // .addSelect('COUNT(name)', 'nameCount')
      .addSelect('SUM(amount)', 'sum')
      // .addSelect('SUM(amount) / :total', 'average')
      // .setParameter('total', spent)
      .andWhere('filer_name = :filerName', { filerName: filerName })
      // .andWhere('tx_type = :txType', { txType: 'EXPN' })
      .andWhere('schedule IN (:...schedules)', { schedules: ['D', 'G', 'E'] })
      .groupBy('spending_code')
      .orderBy('sum', 'DESC')
      .limit(limit)
      .getRawMany();

    return groups;
  }
}
