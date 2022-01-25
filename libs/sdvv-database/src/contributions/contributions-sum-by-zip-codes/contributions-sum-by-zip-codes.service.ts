import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { RCPTEntity } from '../../tables-xlsx/rcpt/rcpt.entity';

@Injectable()
export class ContributionsSumByZipCodes {
  constructor(private connection: Connection) {}

  private RCPTTypes = ['A', 'C'];

  async getContributionInZipCodes(committeeName: string, zipCodes: string[]) {
    const query = this.connection

      .getRepository(RCPTEntity)
      .createQueryBuilder()
      .select('COALESCE(ROUND(SUM(amount)), 0)::int', 'sum')

      .andWhere('filer_naml = :committeeName', { committeeName })
      .andWhere('rec_type = :recType', { recType: 'RCPT' })
      .andWhere('form_type IN (:...formType)', { formType: this.RCPTTypes })
      .andWhere('ctrib_zip4 IN (:...zipCodes)', { zipCodes });

    const { sum } = await query.getRawOne();
    return sum;
  }

  async getContributionOutZipCodes(committeeName: string, zipCodes: string[]) {
    const query = this.connection

      .getRepository(RCPTEntity)
      .createQueryBuilder()
      .select('COALESCE(ROUND(SUM(amount)), 0)::int', 'sum')

      .andWhere('filer_naml = :committeeName', { committeeName })
      .andWhere('rec_type = :recType', { recType: 'RCPT' })
      .andWhere('form_type IN (:...formType)', { formType: this.RCPTTypes })
      .andWhere('ctrib_zip4 NOT IN (:...zipCodes)', { zipCodes });
    // .andWhere('ctrib_zip4 IS NOT NULL');

    const { sum } = await query.getRawOne();
    return sum;
  }
}
