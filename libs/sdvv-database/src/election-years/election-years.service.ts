import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CandidateEntity } from '../candidate/candidates.entity';

@Injectable()
export class ElectionYearsService {
  constructor(private dataSource: DataSource) {}

  async getYears({ electionYear = null }) {
    const query = this.dataSource
      .getRepository(CandidateEntity)
      .createQueryBuilder()
      .select('election_year', 'year')
      .addSelect('COUNT(election_year)', 'candidateCount')

      .andWhere('jurisdiction_code = :jurCode', { jurCode: 'CIT' })
      .andWhere('candidate_controlled_committee_name IS NOT NULL')

      .groupBy('election_year')
      .orderBy('year', 'DESC');

    if (electionYear) {
      query.andWhere('election_year = :electionYear', { electionYear });
    }

    const years = await query.getRawMany();
    return years;
  }
}
