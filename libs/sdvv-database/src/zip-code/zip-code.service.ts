import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { JurisdictionEntity } from '@app/sdvv-database/jurisdictions/jurisdictions.entity';
import { ZipCodeEntity } from '@app/sdvv-database/zipCodes/zipCodes.entity';

/**
 * getDistrictZipCodes() and getCityZipCodes() could be relocated
 *  into a module for Jurisdictions.
 */
@Injectable()
export class ZipCodeService {
  constructor(private dataSource: DataSource) {}

  async getDistrictZipCodes(district: string) {
    const results = await this.dataSource
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
    const results = await this.dataSource
      .getRepository(JurisdictionEntity)
      .createQueryBuilder()
      .select('*')
      .getRawMany();
    const zipCodeGroups = results.map((result) => result.zipCodes);
    const uniqueZipCodes = [...new Set(zipCodeGroups.flat())];
    return uniqueZipCodes;
  }

  async getCountyZipCodes(countyName = 'San Diego County') {
    const results = await this.dataSource
      .getRepository(ZipCodeEntity)
      .createQueryBuilder()
      .select('zip')
      .where('county = :countyName', { countyName })
      .getRawMany();

    return results.map((result) => result.zip);
  }

  async getStateZipCodes(stateAbbreviation = 'CA') {
    const results = await this.dataSource
      .getRepository(ZipCodeEntity)
      .createQueryBuilder()
      .select('zip')
      .where('state = :stateAbbreviation', { stateAbbreviation })
      .getRawMany();

    return results.map((result) => result.zip);
  }
}
