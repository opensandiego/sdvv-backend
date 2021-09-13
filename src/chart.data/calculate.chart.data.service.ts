import { Injectable } from '@nestjs/common';
import { CandidateEntity } from 'src/candidates/candidates.entity';
import { Connection } from 'typeorm';
import { TransactionEntity } from '../transactions/transactions.entity';
@Injectable()
export class CalculateChartDataService {
  constructor(private connection: Connection) {}

  async getFilerNameFromCoeId(id: string) {
    const { candidate_controlled_committee_name: filerName } =
      await this.connection.getRepository(CandidateEntity).findOne({
        select: ['candidate_controlled_committee_name'],
        where: {
          coe_id: id,
        },
      });

    return filerName;
  }

  async getRaisedAndSpentFromName(filerName: string) {
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

    return { raisedSum, spentSum, filerName };
  }
}
