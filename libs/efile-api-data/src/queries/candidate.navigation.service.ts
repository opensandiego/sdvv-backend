import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { CandidateEntity } from '../tables/entity/candidates.entity';

@Injectable()
export class CandidateNavigationService {
  constructor(private connection: Connection) {}

  async getCandidateNavigation(electionId: string) {
    const candidateNavigation = await this.connection
      .getRepository(CandidateEntity)
      .createQueryBuilder()
      .select('coe_id', 'id')
      .addSelect('candidate_name', 'fullName')
      .addSelect('office', 'officeType')
      .addSelect('jurisdiction_name')
      .addSelect('district', 'seatName')
      .where('election_id = :electionId', { electionId: electionId })
      .getRawMany();

    candidateNavigation.forEach((candidate) => {
      candidate.fullOfficeName = candidate.seatName
        ? `${candidate.officeType} ${candidate.jurisdiction_name} - Dist ${candidate.seatName}`
        : `${candidate.officeType} ${candidate.jurisdiction_name}`;
      candidate.seatType = candidate.seatName ? 'district' : null;
      // candidate.seat = candidate.seatName // seat is temporary
      //   ? { name: candidate.seatName, type: 'district' }
      //   : null;
      candidate.inGeneralElection = true;

      return candidate;
    });

    return candidateNavigation;
  }
}
