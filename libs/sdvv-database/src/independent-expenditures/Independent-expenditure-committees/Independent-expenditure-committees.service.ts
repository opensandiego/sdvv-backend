import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { EXPNEntity } from '../../tables-xlsx/expn/expn.entity';
import { S496Entity } from '@app/sdvv-database/tables-xlsx/s496/s496.entity';

interface Committee {
  name: string;
}
export interface IndependentExpenditureCommittee {
  committeeName: string;
  committee: Committee;
  sum: number;
}

@Injectable()
export class IndependentExpenditureCommitteesService {
  constructor(private dataSource: DataSource) {}

  private EXPNTypes = ['D'];
  private monthDay = '12/31';
  private months = '24';

  getDate(year: string): string {
    return `${this.monthDay}/${year}`;
  }

  async supportCommittees(
    candidateName: string,
    electionYear: string,
  ): Promise<IndependentExpenditureCommittee[]> {
    return this.getBothCommittees(candidateName, 'SUPPORT', electionYear);
  }

  async opposeCommittees(
    candidateName: string,
    electionYear: string,
  ): Promise<IndependentExpenditureCommittee[]> {
    return this.getBothCommittees(candidateName, 'OPPOSE', electionYear);
  }

  async getBothCommittees(
    candidateName: string,
    supOppCd: string,
    electionYear: string,
  ): Promise<IndependentExpenditureCommittee[]> {
    const yearEndDate = `${this.monthDay}/${electionYear}`;

    const f460Committees = await this.getIndependentExpenditureCommittees(
      candidateName,
      supOppCd,
      yearEndDate,
    );

    const f496Committees = await this.getLateIndependentExpenditureCommittees(
      candidateName,
      supOppCd,
      yearEndDate,
    );

    // Both lists are empty
    if (f460Committees.length < 1 && f496Committees.length < 1) return [];

    // Both lists have items
    if (f460Committees.length > 0 && f496Committees.length > 0) {
      const combinedList = this.combineCommitteeLists(
        f460Committees,
        f496Committees,
      );
      return combinedList;
    }

    // Only one list has items
    return [...f460Committees, ...f496Committees];
  }

  combineCommitteeLists(
    list1: IndependentExpenditureCommittee[],
    list2: IndependentExpenditureCommittee[],
  ): IndependentExpenditureCommittee[] {
    const committeeMap = new Map();

    list1.forEach((committee) =>
      committeeMap.set(committee.committeeName, committee),
    );

    list2.forEach((committee) => {
      const foundCommittee = committeeMap.get(committee.committeeName);
      if (foundCommittee) {
        const newSum = foundCommittee.sum + committee.sum;
        const newCommittee = { ...foundCommittee, sum: newSum };
        committeeMap.set(foundCommittee.committeeName, newCommittee);
      }
    });

    return Array.from(committeeMap.values());
  }

  async getIndependentExpenditureCommittees(
    candidateName: string,
    supOppCd: string,
    electionDate: string,
  ): Promise<IndependentExpenditureCommittee[]> {
    const query = this.dataSource
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
    return committees.map((committee) => ({
      ...committee,
      sum: parseInt(committee.sum),
    }));
  }

  async getLateIndependentExpenditureCommittees(
    candidateName: string,
    supOppCd: string,
    electionDate: string,
  ): Promise<IndependentExpenditureCommittee[]> {
    const query = this.dataSource
      .getRepository(S496Entity)
      .createQueryBuilder()
      .select('filer_naml', 'committeeName')
      .addSelect(`json_build_object ('name', filer_naml)`, 'committee')
      .addSelect('ROUND(SUM(amount))', 'sum')

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

      .groupBy('filer_naml')
      .orderBy('sum', 'DESC');

    const committees = await query.getRawMany();
    return committees.map((committee) => ({
      ...committee,
      sum: parseInt(committee.sum),
    }));
  }
}
