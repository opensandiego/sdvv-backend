import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { TransactionEntity } from '@app/efile-api-data/tables/entity/transactions.entity';
import { CandidateEntity } from '@app/efile-api-data/tables/entity/candidates.entity';

@Injectable()
export class ContributionsService {
  constructor(private connection: Connection) {}

  async getContributionAvg(filerName: string) {
    const { avg: contributionAvg } = await this.connection
      .getRepository(TransactionEntity)
      .createQueryBuilder()
      .select('AVG(amount)', 'avg')
      .where('include_in_calculations = true')
      .andWhere('filer_name = :filerName', { filerName: filerName })
      .andWhere('schedule IN (:...schedules)', { schedules: ['A', 'C', 'I'] })
      .getRawOne();

    return parseInt(contributionAvg);
  }

  async getContributionCount(filerName: string) {
    const { count: contributionCount } = await this.connection
      .getRepository(TransactionEntity)
      .createQueryBuilder()
      .select('COUNT( DISTINCT name)', 'count')
      .where('include_in_calculations = true')
      .andWhere('filer_name = :filerName', { filerName: filerName })
      .andWhere('schedule IN (:...schedules)', { schedules: ['A', 'C', 'I'] })
      .getRawOne();

    return parseInt(contributionCount);
  }

  async getCandidateCount(election_id: string) {
    return await this.connection
      .getRepository(CandidateEntity)
      .createQueryBuilder()
      .select('office')
      .addSelect('COUNT(office)', 'officeCount')
      .where('election_id = :electionId', { electionId: election_id })

      .groupBy('office')
      .getRawMany();
  }

  async getRaisedByOffice(election_id: string) {
    const offices = await this.connection
      .getRepository(CandidateEntity)
      .createQueryBuilder()
      .select('office')
      .addSelect(
        'ARRAY_AGG (candidate_controlled_committee_name)',
        'candidate_committee_names',
      )
      .where('election_id = :electionId', { electionId: election_id })
      .groupBy('office')
      .getRawMany();

    for await (const office of offices) {
      const { sum: raisedSum } = await this.connection
        .getRepository(TransactionEntity)
        .createQueryBuilder()
        .select('SUM(amount)', 'sum')
        .where('include_in_calculations = true')
        .andWhere('filer_name IN (:...filerNames)', {
          filerNames: office.candidate_committee_names,
        })
        .andWhere('schedule IN (:...schedules)', { schedules: ['A', 'C', 'I'] })
        .getRawOne();

      office.totalRaised = raisedSum;
      delete office.candidate_committee_names;
    }

    return offices;
  }
}
