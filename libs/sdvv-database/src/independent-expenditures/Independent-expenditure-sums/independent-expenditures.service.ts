import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CandidateEntity } from '@app/sdvv-database/candidate/candidates.entity';

@Injectable()
export class IndependentExpendituresService {
  constructor(private dataSource: DataSource) {}

  async getIndependentExpendituresSupOppSum({
    candidateId,
    supOppCd,
  }: {
    candidateId: string;
    supOppCd: 'SUPPORT' | 'OPPOSE';
  }): Promise<number> {
    const candidateQuery = this.dataSource
      .getRepository(CandidateEntity)
      .createQueryBuilder('c')
      .leftJoinAndSelect(
        'c.expn_supp_opp_transactions',
        'expn_supp_opp_transactions',
      )
      .leftJoinAndSelect(
        'c.s496_supp_opp_transactions',
        's496_supp_opp_transactions',
        's496_supp_opp_transactions.is_duplicate IS NULL OR s496_supp_opp_transactions.is_duplicate = :isDuplicate',
        { isDuplicate: false },
      )
      .where('c.candidate_id = :candidateId', { candidateId });

    const candidate = await candidateQuery.getOne();

    if (!candidate) return 0;

    const f460Sum = candidate.expn_supp_opp_transactions
      .filter((transaction) => transaction.supp_opp_cd === supOppCd)
      .reduce(
        (accumulator, transaction) =>
          accumulator + Number(transaction.amount || 0),
        0,
      );

    const s496Sum = candidate.s496_supp_opp_transactions
      .filter((transaction) => transaction.supp_opp_cd === supOppCd)
      .reduce(
        (accumulator, transaction) =>
          accumulator + Number(transaction.amount || 0),
        0,
      );

    return f460Sum + s496Sum;
  }
}
