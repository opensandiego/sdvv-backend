import { Injectable } from '@nestjs/common';
import { Brackets, Connection } from 'typeorm';
import { CalculationTransaction } from '../tables/entity/calculation.transactions.entity';

@Injectable()
export class CandidateSummaryService {
  constructor(private connection: Connection) {}

  async getRaisedSum(filerName: string) {
    const { sum: raisedSum } = await this.connection
      .getRepository(CalculationTransaction)
      .createQueryBuilder()
      .select('SUM(amount)', 'sum')
      .andWhere('filer_name = :filerName', { filerName: filerName })
      .andWhere('schedule IN (:...schedules)', { schedules: ['A', 'C', 'I'] })
      .getRawOne();

    return raisedSum;
  }

  async getSpentSum(filerName: string) {
    const { sum: spentSum } = await this.connection
      .getRepository(CalculationTransaction)
      .createQueryBuilder()
      .select('SUM(amount)', 'sum')
      .andWhere('filer_name = :filerName', { filerName: filerName })
      .andWhere('schedule IN (:...schedules)', { schedules: ['D', 'G', 'E'] })
      .getRawOne();

    return spentSum;
  }

  async getContributionCount(filerName: string) {
    const { count: contributionCount } = await this.connection
      .getRepository(CalculationTransaction)
      .createQueryBuilder()
      .select('COUNT( DISTINCT name)', 'count')
      .andWhere('filer_name = :filerName', { filerName: filerName })
      .andWhere('schedule IN (:...schedules)', { schedules: ['A', 'C', 'I'] })
      .getRawOne();

    return parseInt(contributionCount);
  }

  async getDonorsCount(filerName: string) {
    return await this.getContributionCount(filerName);
  }

  async getContributionAvg(filerName: string) {
    const { avg: contributionAvg } = await this.connection
      .getRepository(CalculationTransaction)
      .createQueryBuilder()
      .select('AVG(amount)', 'avg')
      .andWhere('filer_name = :filerName', { filerName: filerName })
      .andWhere('schedule IN (:...schedules)', { schedules: ['A', 'C', 'I'] })
      .getRawOne();

    return parseInt(contributionAvg);
  }

  async getAverageDonation(filerName: string) {
    return await this.getContributionAvg(filerName);
  }

  async getRaisedIndividualSum(filerName: string) {
    const { sum } = await this.connection
      .getRepository(CalculationTransaction)
      .createQueryBuilder()
      .select('SUM(amount)', 'sum')
      .where('filer_name = :filerName', { filerName: filerName })
      .andWhere('tx_type = :txType', { txType: 'RCPT' })
      .andWhere('NOT (employer = :na AND occupation = :na)', { na: 'N/A' })
      .andWhere('NOT (employer IS NULL AND occupation IS NULL)')
      // Individual also includes the In-Kind
      // .andWhere('NOT (spending_code iLike :spendingCode)', {
      //   spendingCode: '%In-Kind%',
      // })
      .getRawOne();

    return sum ? sum : 0;
  }

  async getRaisedInKindSum(filerName: string) {
    const { sum } = await this.connection
      .getRepository(CalculationTransaction)
      .createQueryBuilder()
      .select('SUM(amount)', 'sum')
      .where('filer_name = :filerName', { filerName: filerName })
      .andWhere('tx_type = :txType', { txType: 'RCPT' })
      .andWhere('spending_code iLike :spendingCode', {
        spendingCode: '%In-Kind%',
      })
      .getRawOne();

    return sum ? sum : 0;
  }

  async getRaisedOtherSum(filerName: string) {
    const { sum } = await this.connection
      .getRepository(CalculationTransaction)
      .createQueryBuilder()
      .select('SUM(amount)', 'sum')
      .where('filer_name = :filerName', { filerName: filerName })
      .andWhere('tx_type = :txType', { txType: 'RCPT' })
      .andWhere(
        new Brackets((qb) => {
          qb.where('(employer = :na AND occupation = :na)', {
            na: 'N/A',
          }).orWhere('(employer IS NULL AND occupation IS NULL)');
        }),
      )
      .getRawOne();

    return sum ? sum : 0;
  }
}
