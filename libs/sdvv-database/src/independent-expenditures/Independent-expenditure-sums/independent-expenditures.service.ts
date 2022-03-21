import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { EXPNEntity } from '../../tables-xlsx/expn/expn.entity';

@Injectable()
export class IndependentExpendituresService {
  constructor(private connection: Connection) {}

  private EXPNTypes = ['D'];
  private monthDay = '12/31';
  private months = '24';

  getDate(year: string): string {
    return `${this.monthDay}/${year}`;
  }

  async supportSum(candidateName: string, electionYear: string) {
    const yearEndDate = `${this.monthDay}/${electionYear}`;

    return this.getIndependentExpendituresSum(
      candidateName,
      'SUPPORT',
      yearEndDate,
    );
  }

  async opposeSum(candidateName: string, electionYear: string) {
    const yearEndDate = `${this.monthDay}/${electionYear}`;

    return this.getIndependentExpendituresSum(
      candidateName,
      'OPPOSE',
      yearEndDate,
    );
  }

  async getIndependentExpendituresSum(
    candidateName: string,
    supOppCd: string,
    electionDate: string,
  ) {
    const { sum: expSum } = await this.connection
      .getRepository(EXPNEntity)
      .createQueryBuilder()
      .select('COALESCE(ROUND(SUM(amount)), 0)', 'sum')

      .where('cand_naml iLike :candidateName', {
        candidateName: `%${candidateName}%`,
      })
      .andWhere('rec_type = :recType', { recType: 'EXPN' })
      .andWhere('form_type IN (:...formType)', { formType: this.EXPNTypes })
      .andWhere('supp_opp_cd = :supOppCd', { supOppCd: supOppCd })
      .andWhere(
        `to_date(expn_date, 'YYYYMMDD') >= to_date(:electionDate, 'MM/DD/YYYY') - interval '${this.months} month'`,
        {
          electionDate,
        },
      )
      .andWhere(
        `to_date(expn_date, 'YYYYMMDD') <= to_date(:electionDate , 'MM/DD/YYYY')`,
        {
          electionDate,
        },
      )
      .getRawOne();

    return expSum ? expSum : 0;
  }
}
