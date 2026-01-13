import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CandidateEntity } from '../candidate/candidates.entity';

@Injectable()
export class OfficesService {
  constructor(private dataSource: DataSource) {}

  async getCommitteeNames({ electionYear, filters }) {
    const query = this.dataSource
      .getRepository(CandidateEntity)
      .createQueryBuilder()
      .select('candidate_controlled_committee_name', 'name')
      .andWhere('election_year = :year', { year: electionYear })
      .andWhere('(candidate_controlled_committee_name IS NOT NULL)');

    this.addWhereFilters(query, filters);

    query.orderBy('name', 'DESC');

    const committees = await query.getRawMany();
    const committeeNames = committees.map((committee) => committee.name);
    return committeeNames;
  }

  private addWhereFilters(query, filters) {
    if (!filters) {
      return;
    }

    if (filters?.offices?.length > 0) {
      const officeList = filters.offices.map((office) => `%${office}%`);
      query.andWhere('office iLike ANY(ARRAY[:...officeList])', {
        officeList,
      });
    }

    if (filters?.districts?.length > 0) {
      const districtList = filters?.districts;
      query.andWhere('district IN (:...districtList)', {
        districtList,
      });
    }

    if (filters?.inPrimaryElection) {
      query.andWhere('in_primary_election = true');
    }

    if (filters?.inGeneralElection) {
      query.andWhere('in_general_election = true');
    }
  }
}
