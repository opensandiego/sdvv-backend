import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { CandidateEntity } from '@app/efile-api-data/tables/entity/candidates.entity';

@Injectable()
export class ElectionYearsService {
  constructor(private connection: Connection) {}

  async getYears({ electionYear = null }) {
    const query = this.connection
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
