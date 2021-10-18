import { Injectable } from '@nestjs/common';
import { CandidateEntity } from '../tables/entity/candidates.entity';
import { Connection } from 'typeorm';

@Injectable()
export class SharedQueryService {
  constructor(private connection: Connection) {}

  async getFilerNameFromId(id: string) {
    return await this.connection
      .getRepository(CandidateEntity)
      .createQueryBuilder('candidate')
      .select('candidate_controlled_committee_name', 'filerName')
      .where('candidate_id = :candidateId', { id })
      .getRawOne();
  }

  async getCandidateFromId(candidateId: string) {
    return await this.connection
      .getRepository(CandidateEntity)
      .createQueryBuilder('candidate')
      .select('*')
      .where('candidate_id = :candidateId', { candidateId })
      .getRawOne();
  }
}
