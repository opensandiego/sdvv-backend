import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CandidateEntity } from './candidates.entity';

@Injectable()
export class CandidateAddService {
  constructor(private dataSource: DataSource) {}

  public async addCandidate(dataTypeArray: any[]) {
    const fieldsToOverwrite = ['district', 'full_office_name', 'updatedAt'];
    const primaryColumns = ['candidate_id'];

    const query = this.dataSource
      .getRepository(CandidateEntity)
      .createQueryBuilder()
      .insert()
      .into(CandidateEntity)
      .values(dataTypeArray)
      .orUpdate(fieldsToOverwrite, primaryColumns);

    await query.execute();
  }
}
