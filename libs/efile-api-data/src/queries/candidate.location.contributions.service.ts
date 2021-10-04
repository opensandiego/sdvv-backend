import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { JurisdictionEntity } from '@app/sdvv-database/jurisdictions/jurisdictions.entity';
import { CalculationTransaction } from '../tables/entity/calculation.transactions.entity';

@Injectable()
export class CandidateLocationContributionsService {
  constructor(private connection: Connection) {}

  async getContributionInZipCodes(filerName: string, zipCodes: string[]) {
    const result = await this.connection
      .getRepository(CalculationTransaction)
      .createQueryBuilder()
      .select('SUM(amount)', 'sum')
      .andWhere('filer_name = :filerName', { filerName: filerName })
      .andWhere('schedule IN (:...schedules)', { schedules: ['A', 'C', 'I'] })
      .andWhere('zip IN (:...zipCodes)', { zipCodes })
      .getRawOne();

    return result.sum;
  }

  async getContributionOutZipCodes(filerName: string, zipCodes: string[]) {
    const result = await this.connection
      .getRepository(CalculationTransaction)
      .createQueryBuilder()
      .select('SUM(amount)', 'sum')
      .andWhere('filer_name = :filerName', { filerName: filerName })
      .andWhere('schedule IN (:...schedules)', { schedules: ['A', 'C', 'I'] })
      .andWhere('zip NOT IN (:...zipCodes)', { zipCodes })
      // .andWhere('zip IS NOT NULL')
      .getRawOne();

    return result.sum;
  }

  async getCityZipCodes() {
    const results = await this.connection
      .getRepository(JurisdictionEntity)
      .createQueryBuilder()
      .select('*')
      .getRawMany();
    const zipCodeGroups = results.map((result) => result.zipCodes);
    const uniqueZipCodes = [...new Set(zipCodeGroups.flat())];
    return uniqueZipCodes;
  }

  async getDistrictZipCodes(district: string) {
    const results = await this.connection
      .getRepository(JurisdictionEntity)
      .createQueryBuilder()
      .select('*')
      .where('name = :district', {
        district: district,
      })
      .getRawOne();

    return results['zipCodes'];
  }
}
