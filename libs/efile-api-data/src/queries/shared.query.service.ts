import { Injectable } from '@nestjs/common';
import { CandidateEntity } from '../tables/entity/candidates.entity';
import { Connection } from 'typeorm';

@Injectable()
export class SharedQueryService {
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

  async getCandidateFromCoeId(candidateId: string) {
    return await this.connection
      .getRepository(CandidateEntity)
      .createQueryBuilder()
      .select('*')
      .where('coe_id = :candidateId', { candidateId })
      .getRawOne();
  }
}
