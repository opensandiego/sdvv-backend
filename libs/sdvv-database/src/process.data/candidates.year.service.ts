import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { CandidateEntity } from '../candidate/candidates.entity';
import { ElectionEntity } from '@app/efile-api-data/tables/entity/elections.entity';

@Injectable()
export class CandidateYearService {
  constructor(private connection: Connection) {}

  async getElectionsByYear(year: string) {
    return await this.connection
      .getRepository(ElectionEntity)
      .createQueryBuilder()
      .select('election_id')
      .addSelect('election_type')
      .addSelect('election_date')
      .where(
        `EXTRACT(YEAR FROM TO_DATE(election_date, 'MM/DD/YYYY')) = :year`,
        {
          year,
        },
      )
      .andWhere('election_type IN (:...election_types)', {
        election_types: ['General', 'Primary'],
      })
      .getRawMany();
  }

  async addInGeneralByYear(filer_ids: string[], year: string) {
    await this.connection
      .createQueryBuilder()
      .update(CandidateEntity)
      .set({ in_general_election: true })
      .where('election_year = :year', { year })
      .andWhere('filer_id IN (:...filer_ids)', { filer_ids })
      .execute();
  }
}
