import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { EXPNEntity } from '../tables-xlsx/expn/expn.entity';

@Injectable()
export class ExpensesService {
  constructor(private connection: Connection) {}

  private EXPNTypes = ['E'];

  async getTotalSpent({ committeeName }) {
    const query = this.connection
      .getRepository(EXPNEntity)
      .createQueryBuilder()
      .select('COALESCE(ROUND(SUM(amount)), 0)', 'sum')

      .andWhere('filer_naml = :committeeName', { committeeName })
      .andWhere('rec_type = :recType', { recType: 'EXPN' })
      .andWhere('form_type IN (:...formType)', { formType: this.EXPNTypes });

    const { sum } = await query.getRawOne();
    return sum;
  }
}
