import { S496Entity } from '@app/sdvv-database/tables-xlsx/s496/s496.entity';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { EXPNEntity } from '../../tables-xlsx/expn/expn.entity';

@Injectable()
export class IndependentExpendituresService {
  constructor(private dataSource: DataSource) {}

  private EXPNTypes = ['D'];
  private monthDay = '12/31';
  private months = '24';

  getDate(year: string): string {
    return `${this.monthDay}/${year}`;
  }

  async supportSum(candidateName: string, electionYear: string) {
    const yearEndDate = `${this.monthDay}/${electionYear}`;

    const f460Sum = await this.getIndependentExpendituresSum(
      candidateName,
      'SUPPORT',
      yearEndDate,
    );

    const f496Sum = await this.getLateIndependentExpendituresSum(
      candidateName,
      'SUPPORT',
      yearEndDate,
    );

    return f460Sum + f496Sum;
  }

  async opposeSum(
    candidateName: string,
    electionYear: string,
  ): Promise<number> {
    const yearEndDate = `${this.monthDay}/${electionYear}`;

    const f460Sum = await this.getIndependentExpendituresSum(
      candidateName,
      'OPPOSE',
      yearEndDate,
    );

    const f496Sum = await this.getLateIndependentExpendituresSum(
      candidateName,
      'OPPOSE',
      yearEndDate,
    );

    return f460Sum + f496Sum;
  }

  async getIndependentExpendituresSum(
    candidateName: string,
    supOppCd: string,
    electionDate: string,
  ): Promise<number> {
    const { sum: expSum } = await this.dataSource
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

    return expSum ? parseInt(expSum) : 0;
  }

  async getLateIndependentExpendituresSum(
    candidateName: string,
    supOppCd: string,
    electionDate: string,
  ): Promise<number> {
    const { sum: expSum } = await this.dataSource
      .getRepository(S496Entity)
      .createQueryBuilder()
      .select('COALESCE(ROUND(SUM(amount)), 0)', 'sum')

      .where('cand_naml iLike :candidateName', {
        candidateName: `%${candidateName}%`,
      })
      .andWhere('rec_type = :recType', { recType: 'S496' })
      .andWhere('form_type IN (:...formType)', { formType: ['F496'] })
      .andWhere('supp_opp_cd = :supOppCd', { supOppCd: supOppCd })
      .andWhere(
        `to_date(exp_date, 'YYYYMMDD') >= to_date(:electionDate, 'MM/DD/YYYY') - interval '${this.months} month'`,
        {
          electionDate,
        },
      )
      .andWhere(
        `to_date(exp_date, 'YYYYMMDD') <= to_date(:electionDate , 'MM/DD/YYYY')`,
        {
          electionDate,
        },
      )
      .getRawOne();

    return expSum ? parseInt(expSum) : 0;
  }
}
