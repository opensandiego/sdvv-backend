import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { EXPNEntity } from '../tables-xlsx/expn/expn.entity';

@Injectable()
export class ExpensesService {
  constructor(private dataSource: DataSource) {}

  private EXPNTypes = ['E'];

  async getTotalSpent({ committeeName }) {
    const query = this.dataSource
      .getRepository(EXPNEntity)
      .createQueryBuilder()
      .select('COALESCE(ROUND(SUM(amount)), 0)', 'sum')

      .andWhere('filer_naml iLike :committeeName', { committeeName })
      .andWhere('rec_type = :recType', { recType: 'EXPN' })
      .andWhere('form_type IN (:...formType)', { formType: this.EXPNTypes });

    const { sum } = await query.getRawOne();
    return sum;
  }
}
