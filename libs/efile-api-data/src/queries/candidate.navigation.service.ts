import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { CandidateEntity } from '../tables/entity/candidates.entity';
import { CandidateNavigation } from 'apps/sdvv-backend-nest/src/api/interfaces/candidate.navigation';

@Injectable()
export class CandidateNavigationService {
  constructor(private connection: Connection) {}

  async getCandidateNavigationByYear(
    year: string,
  ): Promise<CandidateNavigation[]> {
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

      delete candidate.jurisdiction_name;

      return candidate;
    });

    return candidateNavigation;
  }
}
