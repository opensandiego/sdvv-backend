import { Injectable } from '@nestjs/common';
import { CandidateEntity } from '@app/efile-api-data/tables/entity/candidates.entity';
import { Connection } from 'typeorm';

@Injectable()
export class SharedCalculateService {
  constructor(private connection: Connection) {}

  async getFilerNameFromCoeId(id: string) {
    const { candidate_controlled_committee_name: filerName } =
      await this.connection.getRepository(CandidateEntity).findOne({
        select: ['candidate_controlled_committee_name'],
        where: {
          coe_id: id,
        },
      });

    return filerName;
  }
}
