import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { ExpensesService } from '../expenses.service';
import { EXPNEntity } from '@app/sdvv-database/tables-xlsx/expn/expn.entity';

@Injectable()
export class ExpensesGroupByService {
  constructor(
    private connection: Connection,
    private expensesService: ExpensesService,
  ) {}

  private EXPNTypes = ['E'];

  async getCategoriesBySpendingCode({ committeeName, limit = 20 }) {
    const totalSpent = await this.expensesService.getTotalSpent({
      committeeName: committeeName,
    });

    if (totalSpent === 0) {
      return [];
    }

    const query = this.connection
      .getRepository(EXPNEntity)
      .createQueryBuilder()
      .select('expn_code', 'code')
      .addSelect('COALESCE(ROUND(SUM(amount)), 0)', 'sum')
      .addSelect(`ROUND(SUM(amount)::decimal / :total * 100, 1)`, 'percent')
      .setParameter('total', totalSpent)

      .addSelect('COUNT(amount)', 'count')

      .andWhere('filer_naml = :committeeName', { committeeName })
      .andWhere('rec_type = :recType', { recType: 'EXPN' })
      .andWhere('form_type IN (:...formType)', { formType: this.EXPNTypes })

      .groupBy('code')
      .orderBy('sum', 'DESC');

    if (limit > 0) {
      query.limit(limit);
    }

    const groups = await query.getRawMany();
    return groups;
  }
}