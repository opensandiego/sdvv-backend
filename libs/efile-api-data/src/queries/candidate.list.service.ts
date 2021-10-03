import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { CalculationTransaction } from '../tables/entity/calculation.transactions.entity';

@Injectable()
export class CandidateListService {
  constructor(private connection: Connection) {}

  async getContributionByOccupation(filerName: string, limit = 20) {
    const groups = await this.connection
      .getRepository(CalculationTransaction)
      .createQueryBuilder()
      .select('occupation')
      .where('filer_name = :filerName', { filerName: filerName })
      // .addSelect('COUNT(occupation)', 'occupationCount')
      // .addSelect('COUNT( DISTINCT name)', 'nameCount')
      .addSelect('SUM(amount)', 'sum')
      .andWhere('schedule IN (:...schedules)', { schedules: ['A', 'C', 'I'] })
      .andWhere('occupation NOT IN (:...excludedOccupations)', {
        excludedOccupations: ['N/A'],
      })
      .groupBy('occupation')
      .orderBy('sum', 'DESC')
      .limit(limit)
      .getRawMany();

    return groups;
  }

  async getContributionByEmployer(filerName: string, limit = 20) {
    const groups = await this.connection
      .getRepository(CalculationTransaction)
      .createQueryBuilder()
      .select('employer')
      // .addSelect('COUNT(employer)', 'employerCount')
      .addSelect('COUNT( DISTINCT name)', 'nameCount')
      .addSelect('SUM(amount)', 'sum')
      .where('filer_name = :filerName', { filerName: filerName })
      .andWhere('schedule IN (:...schedules)', { schedules: ['A', 'C', 'I'] })
      .groupBy('employer')
      .orderBy('sum', 'DESC')
      .limit(limit)
      .getRawMany();

    return groups;
  }

  async getContributionByName(filerName: string, limit = 20) {
    const groups = await this.connection
      .getRepository(CalculationTransaction)
      .createQueryBuilder()
      .select('name')
      // .addSelect('COUNT(name)', 'nameCount')
      .addSelect('SUM(amount)', 'sum')
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
      .getRepository(CalculationTransaction)
      .createQueryBuilder()
      .select('intr_name')
      .addSelect('COUNT(name)', 'nameCount')
      .addSelect('SUM(amount)', 'sum')
      .andWhere('filer_name = :filerName', { filerName: filerName })
      .andWhere('schedule IN (:...schedules)', { schedules: ['A', 'C', 'I'] })
      .groupBy('intr_name')
      .orderBy('sum', 'DESC')
      .limit(limit)
      .getRawMany();

    return groups;
  }
}
