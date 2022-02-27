import { Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CandidateEntity } from './candidates.entity';

@Injectable()
export class CandidateQLService {
  constructor(
    private connection: Connection,
    @InjectRepository(CandidateEntity)
    private candidateRepository: Repository<CandidateEntity>,
  ) {}

  async getCandidate({ candidateId }) {
    const query = this.connection
      .getRepository(CandidateEntity)
      .createQueryBuilder()
      .andWhere('candidate_id = :candidateId', { candidateId });

    this.addSelectionFields(query);

    const candidate = await query.getRawOne();
    return candidate;
  }

  async getDistrict(committeeName) {
    const candidate = await this.getCandidateFromCommittee({
      committeeName,
    });

    const { district } = candidate;
    return district;
  }

  async getCandidateFromCommittee({ committeeName }) {
    const query = this.connection
      .getRepository(CandidateEntity)
      .createQueryBuilder()
      .andWhere('candidate_controlled_committee_name = :committeeName', {
        committeeName,
      });

    this.addSelectionFields(query);

    const candidate = await query.getRawOne();
    return candidate;
  }

  async getCandidates({ electionYear, filters }) {
    const query = this.connection
      .getRepository(CandidateEntity)
      .createQueryBuilder()
      .andWhere('election_year = :electionYear', { electionYear })

      // This limits the results to city offices and excludes
      // state offices that may show up in the data.
      .andWhere('jurisdiction_code = :jurCode', { jurCode: 'CIT' })
      .andWhere('candidate_controlled_committee_name IS NOT NULL');

    this.addSelectionFields(query);
    this.addWhereFilters(query, filters);

    query.orderBy('in_general_election', 'DESC');
    query.addOrderBy('first_name', 'ASC');

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

  getOfficeList(offices): string[] {
    const officeList = [];

    if (offices.includes('MAYOR')) {
      officeList.push('Mayor');
    }
    if (offices.includes('CITY_COUNCIL')) {
      officeList.push('City Council');
    }
    if (offices.includes('CITY_ATTORNEY')) {
      officeList.push('City Attorney');
    }

    return officeList;
  }

  addWhereFilters(query, filters) {
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
  }
}
