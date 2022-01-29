import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { CandidateEntity } from '@app/efile-api-data/tables/entity/candidates.entity';

@Injectable()
export class OfficesService {
  constructor(private connection: Connection) {}

  async getCommitteeNames({ officeName, electionYear }) {
    const query = this.connection
      .getRepository(CandidateEntity)
      .createQueryBuilder()
      .select('candidate_controlled_committee_name', 'name')
      .andWhere('UPPER(office) = UPPER(:officeName)', { officeName })
      .andWhere('election_year = :year', { year: electionYear })
      .andWhere('(candidate_controlled_committee_name IS NOT NULL)')

      .orderBy('name', 'DESC');

    const committees = await query.getRawMany();
    const committeeNames = committees.map((committee) => committee.name);
    return committeeNames;
  }
}
