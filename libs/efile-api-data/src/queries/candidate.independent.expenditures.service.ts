import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { EXPNEntity } from '@app/sdvv-database/tables-xlsx/expn/expn.entity';

@Injectable()
export class CandidateIndependentExpendituresService {
  constructor(private connection: Connection) {}

  // private RCPTTypes = ['A', 'C', 'I', 'F496P3'];
  private RCPTTypes = ['A', 'C', 'I'];
  private EXPNTypes = ['D', 'E', 'G'];

  async support(candidateName: string, electionDate: string) {
    return this.getIndependentExpendituresSum(
      candidateName,
      'SUPPORT',
      electionDate,
    );
  }

  async opposed(candidateName: string, electionDate: string) {
    return this.getIndependentExpendituresSum(
      candidateName,
      'OPPOSE',
      electionDate,
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
      .select('SUM(amount)', 'sum')
      .where('cand_naml iLike :candidateName', {
        candidateName: `%${candidateName}%`,
      })
      .andWhere('rec_type = :recType', { recType: 'EXPN' })
      .andWhere('form_type IN (:...formType)', { formType: this.EXPNTypes })
      .andWhere('expn_code = :spendingCode', { spendingCode: 'IND' })
      .andWhere('supp_opp_cd = :supOppCd', { supOppCd: supOppCd })
      .andWhere(
        `to_date(expn_date, 'YYYYMMDD') >= to_date(:electionDate, 'MM/DD/YYYY') - interval '16 month'`,
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

  async supportList(candidateName: string, electionDate: string, limit = 20) {
    return await this.getIndependentExpendituresList(
      candidateName,
      'SUPPORT',
      electionDate,
      limit,
    );
  }

  async opposeList(candidateName: string, electionDate: string, limit = 20) {
    return await this.getIndependentExpendituresList(
      candidateName,
      'OPPOSE',
      electionDate,
      limit,
    );
  }

  private async getIndependentExpendituresList(
    candidateName: string,
    supOppCd: string,
    electionDate: string,
    limit,
  ) {
    const expSum = await this.getIndependentExpendituresSum(
      candidateName,
      supOppCd,
      electionDate,
    );

    const groups = await this.connection
      .getRepository(EXPNEntity)
      .createQueryBuilder()
      .select('filer_naml', 'committee')
      .addSelect('SUM(amount)', 'sum')
      .addSelect(`round(SUM(amount)::decimal * 100 / :total, 1)`, 'average')
      .setParameter('total', expSum)
      .where('cand_naml iLike :candidateName', {
        candidateName: `%${candidateName}%`,
      })
      .andWhere('rec_type = :recType', { recType: 'EXPN' })
      .andWhere('form_type IN (:...formType)', { formType: this.EXPNTypes })

      .andWhere('expn_code = :spendingCode', { spendingCode: 'IND' })
      .andWhere('supp_opp_cd = :supOppCd', { supOppCd: supOppCd })
      .andWhere(
        `to_date(expn_date, 'YYYYMMDD') >= to_date(:electionDate, 'MM/DD/YYYY') - interval '16 month'`,
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
      .orderBy('sum', 'DESC')
      .limit(limit)
      .getRawMany();

    return groups;
  }
}
