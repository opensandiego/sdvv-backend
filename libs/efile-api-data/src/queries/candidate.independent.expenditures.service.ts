import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { CalculationTransaction } from '../tables/entity/calculation.transactions.entity';

@Injectable()
export class CandidateIndependentExpendituresService {
  constructor(private connection: Connection) {}

  async support(candidateName: string, electionDate: string) {
    return this.getIndependentExpenditures(
      candidateName,
      'SUPPORT',
      electionDate,
    );
  }

  async opposed(candidateName: string, electionDate: string) {
    return this.getIndependentExpenditures(
      candidateName,
      'OPPOSE',
      electionDate,
    );
  }

  async getIndependentExpenditures(
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
}
