import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { CalculationTransaction } from '../tables/entity/calculation.transactions.entity';

@Injectable()
export class RaisedCommitteeService {
  constructor(private connection: Connection) {}

  async getRaisedByCommittee(committeeName: string) {
    return this.getRaisedByCommittees([committeeName]);
  }

  async getRaisedByCommittees(committeeNames?: string[]) {
    const result = await this.connection
      .getRepository(CalculationTransaction)
      .createQueryBuilder()
      .select()
      .select('SUM(amount)', 'sum')
      .where('filer_name IN (:...filerNames)', {
        filerNames: committeeNames,
      })
      .andWhere('schedule IN (:...schedules)', { schedules: ['A', 'C', 'I'] })
      .getRawOne();

    return result['sum'];
  }
}
