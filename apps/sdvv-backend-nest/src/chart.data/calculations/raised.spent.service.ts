import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { TransactionEntity } from 'src/transactions/transactions.entity';

@Injectable()
export class RaisedSpentService {
  constructor(private connection: Connection) {}

  async getRaisedAndSpent(filerName: string) {
    const raisedSum = await this.getRaisedSum(filerName);
    const spentSum = await this.getSpentSum(filerName);

    return { raisedSum, spentSum };
  }

  async getRaisedSum(filerName: string) {
    const { sum: raisedSum } = await this.connection
      .getRepository(TransactionEntity)
      .createQueryBuilder()
      .select('SUM(amount)', 'sum')
      .where('include_in_calculations = true')
      .andWhere('filer_name = :filerName', { filerName: filerName })
      .andWhere('schedule IN (:...schedules)', { schedules: ['A', 'C', 'I'] })
      .getRawOne();

    return raisedSum;
  }

  async getSpentSum(filerName: string) {
    const { sum: spentSum } = await this.connection
      .getRepository(TransactionEntity)
      .createQueryBuilder()
      .select('SUM(amount)', 'sum')
      .where('include_in_calculations = true')
      .andWhere('filer_name = :filerName', { filerName: filerName })
      .andWhere('schedule IN (:...schedules)', { schedules: ['D', 'G', 'E'] })
      .getRawOne();

    return spentSum;
  }
}
