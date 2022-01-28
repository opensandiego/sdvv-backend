import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { CandidateEntity } from '@app/efile-api-data/tables/entity/candidates.entity';

@Injectable()
export class ElectionYearsService {
  constructor(private connection: Connection) {}

  async getYears() {
    const query = this.connection
      .getRepository(CandidateEntity)
      .createQueryBuilder()
      .select('election_year', 'year')
      .groupBy('election_year')
      .orderBy('year', 'DESC');

    const years = await query.getRawMany();
    return years;
  }
}
