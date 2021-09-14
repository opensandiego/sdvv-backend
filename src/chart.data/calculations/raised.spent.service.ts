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

  private async getRaisedSum(filerName: string) {
    const { sum: raisedSum } = await this.connection
      .getRepository(TransactionEntity)
      .createQueryBuilder()
      .select('SUM(amount)', 'sum')
      .where(
        'filer_name = :filerName AND schedule IN (:...schedules) AND include_in_calculations = true',
        {
          filerName: filerName,
          schedules: ['A', 'C', 'I'],
        },
      )
      .getRawOne();

    return raisedSum;
  }

  private async getSpentSum(filerName: string) {
    const { sum: spentSum } = await this.connection
      .getRepository(TransactionEntity)
      .createQueryBuilder()
      .select('SUM(amount)', 'sum')
      .where(
        'filer_name = :filerName AND schedule IN (:...schedules) AND include_in_calculations = true',
        {
          filerName: filerName,
          schedules: ['D', 'G', 'E'],
        },
      )
      .getRawOne();

    return spentSum;
  }
}
