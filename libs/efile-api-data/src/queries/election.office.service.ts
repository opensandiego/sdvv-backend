import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { CandidateEntity } from '../tables/entity/candidates.entity';

@Injectable()
export class ElectionOfficeService {
  constructor(private connection: Connection) {}

  async getOfficesByYear(year: string) {
    return await this.connection
      .getRepository(CandidateEntity)
      .createQueryBuilder()
      .select('office')
      .addSelect('COUNT(office)', 'candidateCount')
      .addSelect(
        'array_remove(array_agg("candidate_controlled_committee_name"), NULL)',
        'committee_names',
      )
      .where('election_year = :year', { year })
      .groupBy('office')
      .getRawMany();
  }
}
