import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { CalculationTransaction } from '../tables/entity/calculation.transactions.entity';

@Injectable()
export class CandidateIndependentExpendituresService {
  constructor(private connection: Connection) {}

  async support(candidateName: string) {
    const { sum: supportSum } = await this.connection
      .getRepository(CalculationTransaction)
      .createQueryBuilder()
      .select('SUM(amount)', 'sum')
      .where('name = :candidateName', { candidateName: candidateName })
      .andWhere('tx_type = :txType', { txType: 'EXPN' })
      .andWhere('spending_code = :spendingCode', { spendingCode: 'IND' })
      .andWhere('sup_opp_cd = :supOppCd', { supOppCd: 'SUPPORT' })
      .getRawOne();

    return supportSum;
  }

  async opposed(candidateName: string) {
    const { sum: opposeSum } = await this.connection
      .getRepository(CalculationTransaction)
      .createQueryBuilder()
      .select('SUM(amount)', 'sum')
      .where('name = :candidateName', { candidateName: candidateName })
      .andWhere('tx_type = :txType', { txType: 'EXPN' })
      .andWhere('spending_code = :spendingCode', { spendingCode: 'IND' })
      .andWhere('sup_opp_cd = :supOppCd', { supOppCd: 'OPPOSE' })
      .getRawOne();

    return opposeSum;
  }
}
