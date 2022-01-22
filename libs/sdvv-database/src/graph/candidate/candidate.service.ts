import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { CandidateEntity } from '@app/efile-api-data/tables/entity/candidates.entity';

@Injectable()
export class CandidateQLService {
  constructor(private connection: Connection) {}

  async getCandidate({ candidateId }) {
    const query = this.connection
      .getRepository(CandidateEntity)
      .createQueryBuilder()
      .andWhere('candidate_id = :candidateId', { candidateId });

    this.addSelectionFields(query);

    const candidate = await query.getRawOne();
    return candidate;
  }

  async getCandidates({ electionYear }) {
    const query = this.connection
      .getRepository(CandidateEntity)
      .createQueryBuilder()
      .andWhere('election_year = :electionYear', { electionYear });

    this.addSelectionFields(query);

    const candidates = await query.getRawMany();
    return candidates;
  }

  addSelectionFields(query) {
    query
      .addSelect('candidate_id', 'id')
      .addSelect('candidate_controlled_committee_name', 'committeeName')
      .addSelect('first_name', 'firstName')
      .addSelect('last_name', 'lastName')
      .addSelect(`CONCAT( first_name, ' ',  last_name )`, 'fullName')
      .addSelect('description')
      .addSelect('image_url', 'imageUrl')
      .addSelect('website')
      .addSelect('agency')
      .addSelect('office')
      .addSelect('jurisdiction_name', 'jurisdictionName')
      .addSelect('district')
      .addSelect('election_year', 'electionYear')
      .addSelect('in_general_election', 'inGeneralElection')
      .addSelect('full_office_name', 'fullOfficeName');
    return query;
  }
}
