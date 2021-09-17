import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { TransactionEntity } from 'src/transactions/transactions.entity';

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

  async getContributionByOccupation(filerName: string, limit = 20) {
    const groups = await this.connection
      .getRepository(TransactionEntity)
      .createQueryBuilder()
      .select('occupation')
      // .addSelect('COUNT(occupation)', 'occupationCount')
      .addSelect('COUNT( DISTINCT name)', 'nameCount')
      .addSelect('SUM(amount)', 'sum')
      .where('include_in_calculations = true')
      .andWhere('filer_name = :filerName', { filerName: filerName })
      .andWhere('schedule IN (:...schedules)', { schedules: ['A', 'C', 'I'] })
      .groupBy('occupation')
      .orderBy('sum', 'DESC')
      .limit(limit)
      .getRawMany();

    return groups;
  }

  async getContributionByEmployer(filerName: string, limit = 20) {
    const groups = await this.connection
      .getRepository(TransactionEntity)
      .createQueryBuilder()
      .select('employer')
      // .addSelect('COUNT(employer)', 'employerCount')
      .addSelect('COUNT( DISTINCT name)', 'nameCount')
      .addSelect('SUM(amount)', 'sum')
      .where('include_in_calculations = true')
      .andWhere('filer_name = :filerName', { filerName: filerName })
      .andWhere('schedule IN (:...schedules)', { schedules: ['A', 'C', 'I'] })
      .groupBy('employer')
      .orderBy('sum', 'DESC')
      .limit(limit)
      .getRawMany();

    return groups;
  }

  async getContributionByName(filerName: string, limit = 20) {
    const groups = await this.connection
      .getRepository(TransactionEntity)
      .createQueryBuilder()
      .select('name')
      // .addSelect('COUNT(name)', 'nameCount')
      .addSelect('SUM(amount)', 'sum')
      .where('include_in_calculations = true')
      .andWhere('filer_name = :filerName', { filerName: filerName })
      .andWhere('schedule IN (:...schedules)', { schedules: ['A', 'C', 'I'] })
      .groupBy('name')
      .orderBy('sum', 'DESC')
      .limit(limit)
      .getRawMany();

    return groups;
  }

  async getContributionByIntrName(filerName: string, limit = 20) {
    const groups = await this.connection
      .getRepository(TransactionEntity)
      .createQueryBuilder()
      .select('intr_name')
      .addSelect('COUNT(name)', 'nameCount')
      .addSelect('SUM(amount)', 'sum')
      .where('include_in_calculations = true')
      .andWhere('filer_name = :filerName', { filerName: filerName })
      .andWhere('schedule IN (:...schedules)', { schedules: ['A', 'C', 'I'] })
      .groupBy('intr_name')
      .orderBy('sum', 'DESC')
      .limit(limit)
      .getRawMany();

    return groups;
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
}
