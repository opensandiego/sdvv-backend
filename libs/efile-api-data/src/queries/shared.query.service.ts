import { Injectable } from '@nestjs/common';
import { CandidateEntity } from '@app/sdvv-database/candidate/candidates.entity';
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

  async getCandidatesIds({ year = '0', office = '', district = '' } = {}) {
    const query = this.connection
      .getRepository(CandidateEntity)
      .createQueryBuilder()
      .select('candidate_id')
      .andWhere('office IN (:...cityOffices)', {
        cityOffices: ['Mayor', 'City Council', 'City Attorney'],
      });

    if (year !== '0') {
      query.andWhere('election_year = :year', { year });
    }

    if (office !== '') {
      query.andWhere('LOWER(office) = LOWER(:office)', { office });
    }

    if (district !== '') {
      query.andWhere('district = :district', { district });
    }

    return await query.getRawMany();
  }
}
