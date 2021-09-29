import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { CandidateEntity } from '@app/efile-api-data/tables/entity/candidates.entity';
import { ElectionEntity } from '@app/efile-api-data/tables/entity/elections.entity';

@Injectable()
export class CandidateCommitteeService {
  constructor(private connection: Connection) {}

  async addCandidateCommittees() { }
}
