import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { EXPNEntity } from '../tables-xlsx/expn/expn.entity';

@Injectable()
export class ExpendituresService {
  constructor(private connection: Connection) {}

  private EXPNTypes = ['D', 'E', 'G'];

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

  async getCategoriesBySpendingCode(committeeName: string, limit = 20) {
    const totalSpent = await this.getTotalSpent({
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

      .andWhere('filer_naml = :committeeName', { committeeName })
      .andWhere('rec_type = :recType', { recType: 'EXPN' })
      .andWhere('form_type IN (:...formType)', { formType: this.EXPNTypes })

      .groupBy('code')
      .orderBy('sum', 'DESC')
      .limit(limit);

    const groups = await query.getRawMany();
    return groups;
  }
}
