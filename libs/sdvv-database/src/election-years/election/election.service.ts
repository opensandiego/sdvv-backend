import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { ElectionEntity } from '@app/efile-api-data/tables/entity/elections.entity';

@Injectable()
export class ElectionService {
  constructor(private connection: Connection) {}

  async getElections(year) {
    const query = this.connection
      .getRepository(ElectionEntity)
      .createQueryBuilder()
      .select('election_id')
      .addSelect('UPPER(election_type)', 'type')
      .addSelect('election_date', 'date')
      .where(
        `EXTRACT(YEAR FROM TO_DATE(election_date, 'MM/DD/YYYY')) = :year`,
        {
          year,
        },
      )
      .andWhere('election_type IN (:...election_types)', {
        election_types: ['General', 'Primary'],
      });

    const elections = await query.getRawMany();
    return elections;
  }
}
