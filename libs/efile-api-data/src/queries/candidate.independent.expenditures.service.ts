import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { CalculationTransaction } from '../tables/entity/calculation.transactions.entity';

@Injectable()
export class CandidateIndependentExpendituresService {
  constructor(private connection: Connection) {}

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
      .getRepository(CalculationTransaction)
      .createQueryBuilder()
      .select('SUM(amount)', 'sum')
      .where('name iLike :candidateName', {
        candidateName: `%${candidateName}%`,
      })
      .andWhere('tx_type = :txType', { txType: 'EXPN' })
      .andWhere('spending_code = :spendingCode', { spendingCode: 'IND' })
      .andWhere('sup_opp_cd = :supOppCd', { supOppCd: supOppCd })
      .andWhere(
        `to_date(transaction_date, 'MM/DD/YYYY') >= to_date(:electionDate, 'MM/DD/YYYY') - interval '16 month'`,
        {
          electionDate,
        },
      )
      .andWhere(
        `to_date(transaction_date, 'MM/DD/YYYY') <= to_date(:electionDate , 'MM/DD/YYYY')`,
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
      .getRepository(CalculationTransaction)
      .createQueryBuilder()
      .select('filer_name')
      .addSelect('SUM(amount)', 'sum')
      .addSelect(`round(SUM(amount)::decimal * 100 / :total, 1)`, 'average')
      .setParameter('total', expSum)
      .where('name iLike :candidateName', {
        candidateName: `%${candidateName}%`,
      })
      .andWhere('tx_type = :txType', { txType: 'EXPN' })
      .andWhere('spending_code = :spendingCode', { spendingCode: 'IND' })
      .andWhere('sup_opp_cd = :supOppCd', { supOppCd: supOppCd })
      .andWhere(
        `to_date(transaction_date, 'MM/DD/YYYY') >= to_date(:electionDate, 'MM/DD/YYYY') - interval '16 month'`,
        {
          electionDate,
        },
      )
      .andWhere(
        `to_date(transaction_date, 'MM/DD/YYYY') <= to_date(:electionDate , 'MM/DD/YYYY')`,
        {
          electionDate,
        },
      )
      .groupBy('filer_name')
      .orderBy('sum', 'DESC')
      .limit(limit)
      .getRawMany();

    return groups;
  }
}
