import { Inject, Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { CandidateEntity } from '../candidate/candidates.entity';
import { TransactionCommitteeService } from './transaction-committee.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class CandidateCommitteeService {
  constructor(
    private connection: Connection,
    private transactionCommitteeService: TransactionCommitteeService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async addCandidateCommittees() {
    try {
      await this.updateCandidateCommittees();

      this.logger.info('Add Committees to Candidates Complete');
    } catch {
      this.logger.error('Error adding Committees to Candidates');
    }
  }

  private async getCandidateCommittee(
    candidate: CandidateEntity,
  ): Promise<string> {
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
          year_str: `%${candidate.election_year}%`,
        },
      )
      .orderBy('LENGTH(committee.entity_name)', 'ASC')
      .getOne();

    const matchingCommitteeName = committeeMatches
      ? committeeMatches['entity_name']
      : null;

    return matchingCommitteeName;
  }

  private async setCommitteesForCandidates(
    candidates: CandidateEntity[],
  ): Promise<CandidateEntity[]> {
    for await (const candidate of candidates) {
      candidate.candidate_controlled_committee_name =
        await this.getCandidateCommittee(candidate);

      const committeeName =
        await this.transactionCommitteeService.getCommitteeFromRCPT(candidate);

      const hasNewCommitteeName =
        committeeName?.toLocaleLowerCase() !==
        candidate?.candidate_controlled_committee_name?.toLocaleLowerCase();

      if (committeeName && hasNewCommitteeName) {
        candidate.candidate_controlled_committee_name = committeeName;
      }
    }

    return candidates;
  }

  private async getAllCandidates(): Promise<CandidateEntity[]> {
    return await this.connection
      .getRepository(CandidateEntity)
      .createQueryBuilder()
      .getMany();
  }

  private async updateCandidateCommittees() {
    let candidates: CandidateEntity[] = await this.getAllCandidates();
    candidates = await this.setCommitteesForCandidates(candidates);
    await this.connection.getRepository(CandidateEntity).save(candidates);
  }
}
