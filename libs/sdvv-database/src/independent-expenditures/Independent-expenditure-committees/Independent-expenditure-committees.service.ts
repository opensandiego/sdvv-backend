import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { EXPNEntity } from '../../tables-xlsx/expn/expn.entity';

@Injectable()
export class IndependentExpenditureCommitteesService {
  constructor(private connection: Connection) {}

  private EXPNTypes = ['D'];
  private monthDay = '12/31';
  private months = '24';

  getDate(year: string): string {
    return `${this.monthDay}/${year}`;
  }

  async supportCommittees(candidateName: string, electionYear: string) {
    const yearEndDate = `${this.monthDay}/${electionYear}`;

    return this.getIndependentExpenditureCommittees(
      candidateName,
      'SUPPORT',
      yearEndDate,
    );
  }

  async opposeCommittees(candidateName: string, electionYear: string) {
    const yearEndDate = `${this.monthDay}/${electionYear}`;

    return this.getIndependentExpenditureCommittees(
      candidateName,
      'OPPOSE',
      yearEndDate,
    );
  }

  async getIndependentExpenditureCommittees(
    candidateName: string,
    supOppCd: string,
    electionDate: string,
  ) {
    const query = this.connection
      .getRepository(EXPNEntity)
      .createQueryBuilder()
      .select('filer_naml', 'committeeName')
      .addSelect(`json_build_object ('name', filer_naml)`, 'committee')
      .addSelect('ROUND(SUM(amount))', 'sum')

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

      .groupBy('filer_naml')
      .orderBy('sum', 'DESC');

    const committees = await query.getRawMany();
    return committees;
  }
}
