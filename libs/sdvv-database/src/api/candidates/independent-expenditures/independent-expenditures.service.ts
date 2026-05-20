import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  CandidateIndependentExpenditures,
  IndependentExpenditureFiler,
} from './interfaces/independent-expenditures.interface';
import { CandidateEntity } from '@app/sdvv-database/candidate/candidates.entity';

@Injectable()
export class CandidateIndependentExpendituresService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getIndependentExpendituresCandidates({
    year,
    office,
    district,
  }: {
    year?: string;
    office?: string;
    district?: string;
  }) {
    // replace dashes '-' in office name with spaces
    office = office?.split('-').join(' ');

    const candidateRepository = this.dataSource.getRepository(CandidateEntity);

    const candidatesQuery = candidateRepository
      .createQueryBuilder('c')
      .leftJoinAndSelect(
        'c.expn_supp_opp_transactions',
        'expn_supp_opp_transactions',
      )
      .leftJoinAndSelect(
        'c.s496_supp_opp_transactions',
        's496_supp_opp_transactions',
        's496_supp_opp_transactions.is_duplicate IS NULL',
      )
      .where('c.candidate_controlled_committee_name IS NOT NULL');

    if (year) {
      candidatesQuery.andWhere('c.election_year = :year', { year });
    }
    if (office) {
      candidatesQuery.andWhere('LOWER(c.office) = LOWER(:office)', { office });
    }
    if (district) {
      candidatesQuery.andWhere('c.district = :district', { district });
    }

    const candidatesFound = await candidatesQuery.getMany();

    const candidateListRows: CandidateIndependentExpenditures[] =
      candidatesFound.map((candidate) => ({
        candidateId: candidate.candidate_id,
        candidateName: candidate.candidate_name,
        inPrimaryElection: candidate.in_primary_election,
        inGeneralElection: candidate.in_general_election,
        f460d: {
          support: this.getIEFilers({
            transactions: candidate.expn_supp_opp_transactions,
            supp_opp_cd: 'SUPPORT',
          }),
          oppose: this.getIEFilers({
            transactions: candidate.expn_supp_opp_transactions,
            supp_opp_cd: 'OPPOSE',
          }),
        },
        s496: {
          support: this.getIEFilers({
            transactions: candidate.s496_supp_opp_transactions,
            supp_opp_cd: 'SUPPORT',
          }),
          oppose: this.getIEFilers({
            transactions: candidate.s496_supp_opp_transactions,
            supp_opp_cd: 'OPPOSE',
          }),
        },
      }));

    return candidateListRows;
  }

  getIEFilers({
    transactions,
    supp_opp_cd,
  }: {
    transactions: {
      filer_naml: string;
      amount: number;
      supp_opp_cd?: string;
    }[];
    supp_opp_cd: 'SUPPORT' | 'OPPOSE';
  }) {
    const filerMap = new Map<string, IndependentExpenditureFiler>();

    transactions
      .filter((transaction) => transaction.supp_opp_cd === supp_opp_cd)
      .forEach((transaction) => {
        // add filer to map if filer does not already exists
        if (!filerMap.has(transaction.filer_naml)) {
          filerMap.set(transaction.filer_naml, {
            filerName: transaction.filer_naml,
            amount: 0,
          });
        }

        const filer = filerMap.get(transaction.filer_naml);
        if (!filer) return;

        filer.amount = filer.amount + Number(transaction.amount || 0);
      });

    return Array.from(filerMap.values());
  }
}
