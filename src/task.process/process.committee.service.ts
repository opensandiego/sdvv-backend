import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { CandidateEntity } from 'src/candidates/candidates.entity';
import { ElectionEntity } from 'src/elections/elections.entity';

@Injectable()
export class ProcessCandidateCommitteeService {
  constructor(private connection: Connection) {}

  private async getCandidateCommittee(
    candidate: CandidateEntity,
    electionDate: string,
  ) {
    let lastName = candidate.last_name;

    if (lastName.includes('-')) {
      lastName = lastName.split('-').join('|');
    }

    if (lastName.includes(' ')) {
      lastName = lastName.split(' ').join('|');
    }

    const office = candidate.office.includes(' ')
      ? candidate.office.split(' ')[1]
      : candidate.office;

    const electionYear = new Date(electionDate).getFullYear();

    const committeeMatches = await this.connection
      .getRepository('committee')
      .createQueryBuilder('committee')
      .where(
        'committee.entity_name_lower SIMILAR TO :name_str' +
          ' AND committee.entity_name_lower iLike :office_str' +
          ' AND committee.entity_name_lower iLike :year_str',
        {
          name_str: `%(${lastName.toLocaleLowerCase()})%`,
          office_str: `%${office}%`,
          year_str: `%${electionYear}%`,
        },
      )
      .orderBy('LENGTH(committee.entity_name)', 'ASC')
      .getOne();

    const matchingCommitteeName = committeeMatches
      ? committeeMatches['entity_name']
      : null;

    return matchingCommitteeName;
  }

  async setCommitteesForCandidates(
    candidates: CandidateEntity[],
  ): Promise<CandidateEntity[]> {
    const electionRepository = this.connection.getRepository(ElectionEntity);

    for await (const candidate of candidates) {
      const election = await electionRepository.findOne(candidate.election_id);

      const committeeName = await this.getCandidateCommittee(
        candidate,
        election.election_date,
      );

      candidate.candidate_controlled_committee_name = committeeName;
    }

    return candidates;
  }

  private async getCandidates(electionID?: string): Promise<CandidateEntity[]> {
    let queryOptions = {};

    if (electionID) {
      queryOptions = {
        where: {
          election_id: electionID,
        },
      };
    }

    return await this.connection
      .getRepository(CandidateEntity)
      .find(queryOptions);
  }

  async updateCandidateCommittees(electionID?: string) {
    let candidates: CandidateEntity[] = await this.getCandidates(electionID);
    candidates = await this.setCommitteesForCandidates(candidates);
    await this.connection.getRepository(CandidateEntity).save(candidates);
  }
}
