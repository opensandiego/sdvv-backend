import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { CandidateEntity } from '../candidate/candidates.entity';
import { RCPTEntity } from '../tables-xlsx/rcpt/rcpt.entity';

@Injectable()
export class TransactionCommitteeService {
  constructor(private connection: Connection) {}

  public async getCommitteeFromRCPT(
    candidate: CandidateEntity,
  ): Promise<string> {
    const lastName = this.getCandidateLastName(candidate);
    const office = this.getCandidateOffice(candidate);

    const query = await this.connection
      .getRepository(RCPTEntity)
      .createQueryBuilder()
      .select('filer_naml', 'committee_name')
      .andWhere('LOWER(filer_naml) SIMILAR TO :name_str', {
        name_str: `%(${lastName.toLocaleLowerCase()})%`,
      })
      .andWhere('filer_naml iLike :office_str', {
        office_str: `%${office}%`,
      })
      .andWhere('filer_naml iLike :year_str', {
        year_str: `%${candidate.election_year}%`,
      })
      .groupBy('filer_naml')
      .orderBy('LENGTH(filer_naml)', 'ASC');

    const committeeMatches = await query.getRawOne();

    return committeeMatches ? committeeMatches['committee_name'] : null;
  }

  private getCandidateLastName(candidate: CandidateEntity): string {
    let lastName = candidate.last_name.trim();

    if (lastName.includes('-')) {
      lastName = lastName.split('-').join('|');
    }

    if (lastName.includes(' ')) {
      lastName = lastName.split(' ').join('|');
    }

    return lastName;
  }

  private getCandidateOffice(candidate: CandidateEntity): string {
    return candidate.office.includes(' ')
      ? candidate.office.split(' ')[1]
      : candidate.office;
  }
}
