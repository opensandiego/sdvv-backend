import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { CandidateEntity } from '../tables/entity/candidates.entity';

@Injectable()
export class CandidateNavigationService {
  constructor(private connection: Connection) {}

  async getCandidateNavigationByYear(year: string) {
    const candidateNavigation = await this.connection
      .getRepository(CandidateEntity)
      .createQueryBuilder()
      .select('candidate_id', 'id')
      .addSelect('candidate_name', 'fullName')
      .addSelect('office', 'officeType')
      .addSelect('jurisdiction_name')
      .addSelect('district', 'seatName')
      .addSelect('in_general_election', 'inGeneralElection')
      .where('election_year = :year', { year })
      .andWhere('office IN (:...cityOffices)', {
        cityOffices: ['Mayor', 'City Council', 'City Attorney'],
      })
      .orderBy('last_name', 'ASC')
      .getRawMany();

    candidateNavigation.forEach((candidate) => {
      candidate.fullOfficeName = candidate.seatName
        ? `${candidate.officeType} ${candidate.jurisdiction_name} - Dist ${candidate.seatName}`
        : `${candidate.officeType} ${candidate.jurisdiction_name}`;
      candidate.seatType = candidate.seatName ? 'district' : null;

      return candidate;
    });

    return candidateNavigation;
  }
}
