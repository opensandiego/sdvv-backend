import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ElectionEntity } from '@app/efile-api-data/tables/entity/elections.entity';

@Injectable()
export class ElectionService {
  constructor(private dataSource: DataSource) {}

  async getElections({ electionYear }) {
    const query = this.dataSource
      .getRepository(ElectionEntity)
      .createQueryBuilder()
      .select('election_id')
      .addSelect('UPPER(election_type)', 'type')
      .addSelect('election_date', 'date')
      .where(
        `EXTRACT(YEAR FROM TO_DATE(election_date, 'MM/DD/YYYY')) = :electionYear`,
        {
          electionYear,
        },
      )
      .andWhere('UPPER(election_type) IN (:...election_types)', {
        election_types: ['GENERAL', 'PRIMARY'],
      });

    const elections = await query.getRawMany();
    return elections;
  }
}
