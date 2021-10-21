import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Candidate } from 'apps/sdvv-backend-nest/src/api/interfaces/candidate';
import { CandidateEntity } from '../tables/entity/candidates.entity';

@Injectable()
export class CandidateService {
  constructor(private connection: Connection) {}

  validOffices = ['Mayor', 'City Council', 'City Attorney'];

  async getCandidates({ year = '0', office = '', district = '' } = {}): Promise<
    Candidate[]
  > {
    const query = this.connection
      .getRepository(CandidateEntity)
      .createQueryBuilder()
      .select('candidate_id', 'id')
      .addSelect(`CONCAT( first_name, ' ',  last_name )`, 'full_name')
      .addSelect('description')
      .addSelect('image_url')
      .addSelect('website')
      .addSelect('agency')
      .addSelect('office')
      .addSelect('district')
      .addSelect('election_year', 'year')
      .addSelect('in_general_election')
      .addSelect('full_office_name')

      .where('office IN (:...cityOffices)', {
        cityOffices: this.validOffices,
      });

    if (year !== '0') {
      query.andWhere('election_year = :year', { year });
    }

    if (office) {
      query.andWhere('office = :office', { office });
    }

    if (district) {
      query.andWhere('district = :district', { district });
    }

    const candidates = await query.getRawMany();

    candidates.forEach((candidate) => {
      candidate.jurisdiction = candidate.district ? 'District' : 'City';
    });

    return candidates;
  }
}
