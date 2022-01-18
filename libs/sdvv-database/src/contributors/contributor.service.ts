import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { RCPTEntity } from '../tables-xlsx/rcpt/rcpt.entity';

@Injectable()
export class ContributorService {
  constructor(private connection: Connection) {}

  private RCPTTypes = ['A', 'C', 'I'];

  // get the summary of all Contributions made to a Committee for each Contributor
  async getContributorSummary({ committeeName, limit = 20 }) {
    const query = this.connection
      .getRepository(RCPTEntity)
      .createQueryBuilder()

      .select(`DISTINCT (CONCAT(ctrib_naml, ', ', ctrib_namf))`, 'name')
      .addSelect('COALESCE(ROUND(SUM(amount)), 0)::int', 'sum')

      .addSelect('COUNT(amount)', 'count')

      .andWhere('filer_naml = :committeeName', { committeeName })
      .andWhere('rec_type = :recType', { recType: 'RCPT' })
      .andWhere('form_type IN (:...formType)', { formType: this.RCPTTypes })

      .groupBy('name')
      .orderBy('sum', 'DESC')
      .addOrderBy('count', 'DESC');

    if (limit > 0) {
      query.limit(limit);
    }

    const groups = await query.getRawMany();
    return groups;
  }
}
