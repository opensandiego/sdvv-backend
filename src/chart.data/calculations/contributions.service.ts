import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { TransactionEntity } from 'src/transactions/transactions.entity';

@Injectable()
export class ContributionsService {
  constructor(private connection: Connection) {}

  async getContributionAvg(filerName: string) {
    const { avg: contributionAvg } = await this.connection
      .getRepository(TransactionEntity)
      .createQueryBuilder()
      .select('AVG(amount)', 'avg')
      .where('include_in_calculations = true')
      .andWhere('filer_name = :filerName', { filerName: filerName })
      .andWhere('schedule IN (:...schedules)', { schedules: ['A', 'C', 'I'] })
      .getRawOne();

    return parseInt(contributionAvg);
  }

  async getContributionCount(filerName: string) {
    const { count: contributionCount } = await this.connection
      .getRepository(TransactionEntity)
      .createQueryBuilder()
      .select('COUNT( DISTINCT name)', 'count')
      .where('include_in_calculations = true')
      .andWhere('filer_name = :filerName', { filerName: filerName })
      .andWhere('schedule IN (:...schedules)', { schedules: ['A', 'C', 'I'] })
      .getRawOne();

    return parseInt(contributionCount);
  }
}
