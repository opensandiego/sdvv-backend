import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { CandidateEntity } from '../tables/entity/candidates.entity';
import { Office } from 'apps/sdvv-backend-nest/src/api/interfaces/office';

@Injectable()
export class ElectionOfficeService {
  constructor(private connection: Connection) {}

  validOffices = ['Mayor', 'City Council', 'City Attorney'];

  async getOfficesByYear(year: string): Promise<Office[]> {
    const query = await this.connection
      .getRepository(CandidateEntity)
      .createQueryBuilder()
      .select('office')
      .addSelect('COUNT(office)', 'candidate_count')
      .addSelect(
        'COUNT(CASE WHEN district IS NOT NULL THEN 1 END) > 0',
        'has_districts',
      )
      .addSelect(
        'ARRAY_REMOVE(ARRAY_AGG( DISTINCT district ), NULL)',
        'districts',
      )
      .addSelect(
        'array_remove(array_agg("candidate_controlled_committee_name"), NULL)',
        'committee_names',
      )
      .addSelect('MAX( election_year )', 'year')
      .where('office IN (:...cityOffices)', {
        cityOffices: this.validOffices,
      })
      .groupBy('office')
      .addGroupBy('election_year')
      .orderBy('election_year', 'DESC')
      .addOrderBy('office', 'DESC');

    if (year !== '0') {
      query.andWhere('election_year = :year', { year });
    }

    return await query.getRawMany();
  }
}
