import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { JurisdictionEntity } from '@app/sdvv-database/jurisdictions/jurisdictions.entity';
import { CalculationTransaction } from '../tables/entity/calculation.transactions.entity';
import { ZipCodeEntity } from '@app/sdvv-database/zipCodes/zipCodes.entity';

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

  async getCountyZipCodes(countyName = 'San Diego County') {
    const results = await this.connection
      .getRepository(ZipCodeEntity)
      .createQueryBuilder()
      .select('zip')
      .where('county = :countyName', { countyName })
      .getRawMany();

    return results.map((result) => result.zip);
  }

  async getStateZipCodes(stateAbbreviation = 'CA') {
    const results = await this.connection
      .getRepository(ZipCodeEntity)
      .createQueryBuilder()
      .select('zip')
      .where('state = :stateAbbreviation', { stateAbbreviation })
      .getRawMany();

    return results.map((result) => result.zip);
  }
}
