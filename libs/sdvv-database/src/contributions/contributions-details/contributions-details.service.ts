import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { RCPTEntity } from '../../tables-xlsx/rcpt/rcpt.entity';

@Injectable()
export class ContributionsDetailsService {
  constructor(private connection: Connection) {}

  private RCPTTypes = ['A', 'C', 'I'];

  async getContributionSum({ committeeName }) {
    const query = this.connection
      .getRepository(RCPTEntity)
      .createQueryBuilder()
      .select('COALESCE(ROUND(SUM(amount)), 0)', 'sum')

      .andWhere('filer_naml = :committeeName', { committeeName })
      .andWhere('rec_type = :recType', { recType: 'RCPT' })
      .andWhere('form_type IN (:...formType)', { formType: this.RCPTTypes });

    const { sum } = await query.getRawOne();
    return sum;
  }

  async getContributionAverage({ committeeName }) {
    const query = this.connection
      .getRepository(RCPTEntity)
      .createQueryBuilder()
      .select('COALESCE(ROUND(AVG(amount)), 0)', 'average')

      .andWhere('filer_naml = :committeeName', { committeeName })
      .andWhere('rec_type = :recType', { recType: 'RCPT' })
      .andWhere('form_type IN (:...formType)', { formType: this.RCPTTypes });

    const { average } = await query.getRawOne();
    return average;
  }

  async getContributorCount({ committeeName }) {
    const query = this.connection
      .getRepository(RCPTEntity)
      .createQueryBuilder()
      .select('COUNT(DISTINCT(ctrib_naml || ctrib_namf))', 'count')

      .andWhere('filer_naml = :committeeName', { committeeName })
      .andWhere('rec_type = :recType', { recType: 'RCPT' })
      .andWhere('form_type IN (:...formType)', { formType: this.RCPTTypes });

    const { count } = await query.getRawOne();
    return count;
  }
}
