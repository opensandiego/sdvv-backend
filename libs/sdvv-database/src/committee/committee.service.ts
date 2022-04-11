import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { CandidateEntity } from '../candidate/candidates.entity';

@Injectable()
export class CommitteeService {
  constructor(private connection: Connection) {}

  async getMD5(input: string) {
    const query = this.connection
      .getRepository(CandidateEntity)
      .createQueryBuilder()
      .select(`MD5(LOWER(:input))`, 'md5')
      .setParameter('input', input);

    const result = await query.getRawOne();
    const { md5 } = result;
    return md5;
  }
}
