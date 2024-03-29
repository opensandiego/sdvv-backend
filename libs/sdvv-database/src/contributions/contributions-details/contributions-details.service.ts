import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { RCPTEntity } from '../../tables-xlsx/rcpt/rcpt.entity';

@Injectable()
export class ContributionsDetailsService {
  constructor(private dataSource: DataSource) {}

  private RCPTTypes = ['A', 'C'];

  async getContributionSum({ committeeName }) {
    const committeeNames = Array.isArray(committeeName)
      ? committeeName
      : [committeeName];

    const query = this.dataSource
      .getRepository(RCPTEntity)
      .createQueryBuilder()
      .select('COALESCE(ROUND(SUM(amount)), 0)', 'sum')
      .andWhere(`filer_naml iLike ANY(ARRAY[:...committeeNames])`, {
        committeeNames,
      })

      .andWhere('rec_type = :recType', { recType: 'RCPT' })
      .andWhere('form_type IN (:...formType)', { formType: this.RCPTTypes });

    const { sum } = await query.getRawOne();
    return sum;
  }

  async getContributionAverage({ committeeName }) {
    const query = this.dataSource
      .getRepository(RCPTEntity)
      .createQueryBuilder()
      .select('COALESCE(ROUND(AVG(amount)), 0)', 'average')

      .andWhere('filer_naml iLike :committeeName', { committeeName })
      .andWhere('rec_type = :recType', { recType: 'RCPT' })
      .andWhere('form_type IN (:...formType)', { formType: this.RCPTTypes });

    const { average } = await query.getRawOne();
    return average;
  }

  async getContributorCount({ committeeName }) {
    const query = this.dataSource
      .getRepository(RCPTEntity)
      .createQueryBuilder()
      .select('COUNT(DISTINCT(ctrib_naml || ctrib_namf))', 'count')

      .andWhere('filer_naml iLike :committeeName', { committeeName })
      .andWhere('rec_type = :recType', { recType: 'RCPT' })
      .andWhere('form_type IN (:...formType)', { formType: this.RCPTTypes });

    const { count } = await query.getRawOne();
    return count;
  }
}
