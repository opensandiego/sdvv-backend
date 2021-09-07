import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { CandidateEntity } from 'src/candidates/candidates.entity';

@Injectable()
export class CandidateCommitteeService {
  constructor(private connection: Connection) {}

  async getCandidateCommittee(
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
      .getOneOrFail();

    return committeeMatches['entity_name'];
  }
}
