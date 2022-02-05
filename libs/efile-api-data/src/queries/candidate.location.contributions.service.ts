import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { JurisdictionEntity } from '@app/sdvv-database/jurisdictions/jurisdictions.entity';
import { ZipCodeEntity } from '@app/sdvv-database/zipCodes/zipCodes.entity';
import { RCPTEntity } from '@app/sdvv-database/tables-xlsx/rcpt/rcpt.entity';

@Injectable()
export class CandidateLocationContributionsService {
  constructor(private connection: Connection) {}

  // private RCPTTypes = ['A', 'C', 'I', 'F496P3'];
  private RCPTTypes = ['A', 'C', 'I'];

  async getContributionInZipCodes(committeeName: string, zipCodes: string[]) {
    const result = await this.connection
      .getRepository(RCPTEntity)
      .createQueryBuilder()
      .select('SUM(amount)', 'sum')
      .andWhere('filer_naml iLike :committeeName', { committeeName })
      .andWhere('rec_type = :recType', { recType: 'RCPT' })
      .andWhere('form_type IN (:...formType)', { formType: this.RCPTTypes })
      .andWhere('ctrib_zip4 IN (:...zipCodes)', { zipCodes })
      .getRawOne();

    return result.sum;
  }

  async getContributionOutZipCodes(committeeName: string, zipCodes: string[]) {
    const result = await this.connection
      .getRepository(RCPTEntity)
      .createQueryBuilder()
      .select('SUM(amount)', 'sum')
      .andWhere('filer_naml iLike :committeeName', { committeeName })
      .andWhere('rec_type = :recType', { recType: 'RCPT' })
      .andWhere('form_type IN (:...formType)', { formType: this.RCPTTypes })
      .andWhere('ctrib_zip4 NOT IN (:...zipCodes)', { zipCodes })
      // .andWhere('ctrib_zip4 IS NOT NULL')
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
