import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { CandidateEntity } from '../tables/entity/candidates.entity';
import { OfficeSummary } from 'apps/sdvv-backend-nest/src/api/interfaces/office.summary';

@Injectable()
export class ElectionOfficeService {
  constructor(private connection: Connection) {}

  async getOfficesByYear(year: string): Promise<OfficeSummary[]> {
    return await this.connection
      .getRepository(CandidateEntity)
      .createQueryBuilder()
      .select('office')
      .addSelect('COUNT(office)', 'candidateCount')
      .addSelect(
        'array_remove(array_agg("candidate_controlled_committee_name"), NULL)',
        'committee_names',
      )
      .addSelect('MAX( election_year )', 'year')
      .where('election_year = :year', { year })
      .andWhere('office IN (:...cityOffices)', {
        cityOffices: ['Mayor', 'City Council', 'City Attorney'],
      })
      .groupBy('office')
      .getRawMany();
  }
}
