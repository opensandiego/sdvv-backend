import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CandidateIndependentExpenditures } from './interfaces/independent-expenditures.interface';
import { CandidateEntity } from '@app/sdvv-database/candidate/candidates.entity';
import { getIEFilers } from '@app/sdvv-database/shared/ie-filers';

@Injectable()
export class CandidateIndependentExpendituresService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  private buildCandidateIEFilers({
    candidate,
  }: {
    candidate: CandidateEntity;
  }): CandidateIndependentExpenditures {
    return {
      candidateId: candidate.candidate_id,
      candidateName: candidate.candidate_name,
      inPrimaryElection: candidate.in_primary_election,
      inGeneralElection: candidate.in_general_election,
      f460d: {
        support: getIEFilers({
          transactions: candidate.expn_supp_opp_transactions,
          supp_opp_cd: 'SUPPORT',
        }),
        oppose: getIEFilers({
          transactions: candidate.expn_supp_opp_transactions,
          supp_opp_cd: 'OPPOSE',
        }),
      },
      s496: {
        support: getIEFilers({
          transactions: candidate.s496_supp_opp_transactions,
          supp_opp_cd: 'SUPPORT',
        }),
        oppose: getIEFilers({
          transactions: candidate.s496_supp_opp_transactions,
          supp_opp_cd: 'OPPOSE',
        }),
      },
    };
  }

  async getIndependentExpendituresCandidate({
    candidateId,
  }: {
    candidateId?: string;
  }): Promise<CandidateIndependentExpenditures> {
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

    if (!candidate) {
      throw new NotFoundException(`Candidate with ID ${candidateId} not found`);
    }

    return this.buildCandidateIEFilers({ candidate });
  }

  async getIndependentExpendituresCandidates({
    year,
    office,
    district,
  }: {
    year?: string;
    office?: string;
    district?: string;
  }): Promise<CandidateIndependentExpenditures[]> {
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
        // when is_duplicate either NULL OR false then it is
        // not a duplicate so include it in the query results
        's496_supp_opp_transactions.is_duplicate IS NULL OR s496_supp_opp_transactions.is_duplicate = :isDuplicate',
        { isDuplicate: false },
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

    return candidatesFound.map((candidate) =>
      this.buildCandidateIEFilers({ candidate }),
    );
  }
}
