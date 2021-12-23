import { Injectable } from '@nestjs/common';
import { Brackets, Connection } from 'typeorm';
import { RCPTEntity } from '@app/sdvv-database/tables-xlsx/rcpt/rcpt.entity';
import { EXPNEntity } from '@app/sdvv-database/tables-xlsx/expn/expn.entity';

@Injectable()
export class CandidateSummaryService {
  constructor(private connection: Connection) {}

  // private RCPTTypes = ['A', 'C', 'I', 'F496P3'];
  private RCPTTypes = ['A', 'C', 'I'];
  private EXPNTypes = ['D', 'E', 'G'];

  async getRaisedSum(committeeName: string) {
    const { sum: raisedSum } = await this.connection
      .getRepository(RCPTEntity)
      .createQueryBuilder()
      .select('COALESCE(SUM(amount), 0)', 'sum')
      .andWhere('filer_naml = :committeeName', { committeeName })
      .andWhere('rec_type = :recType', { recType: 'RCPT' })
      .andWhere('form_type IN (:...formType)', { formType: this.RCPTTypes })
      .getRawOne();

    return raisedSum;
  }

  async getSpentSum(committeeName: string) {
    const { sum } = await this.connection
      .getRepository(EXPNEntity)
      .createQueryBuilder()
      .select('COALESCE(SUM(amount), 0)', 'sum')
      .andWhere('filer_naml = :committeeName', { committeeName })
      .andWhere('rec_type = :recType', { recType: 'EXPN' })
      .andWhere('form_type IN (:...formType)', { formType: this.EXPNTypes })
      .getRawOne();

    return sum;
  }

  async getContributionCount(committeeName: string) {
    const { count: contributionCount } = await this.connection
      .getRepository(RCPTEntity)
      .createQueryBuilder()
      .select('COUNT( DISTINCT (ctrib_naml || ctrib_namf))', 'count')
      .andWhere('filer_naml = :committeeName', { committeeName })
      .andWhere('rec_type = :recType', { recType: 'RCPT' })
      .andWhere('form_type IN (:...formType)', { formType: this.RCPTTypes })
      .getRawOne();

    return contributionCount;
  }

  async getDonorsCount(filerName: string) {
    return await this.getContributionCount(filerName);
  }

  async getContributionAvg(committeeName: string) {
    const { avg: contributionAvg } = await this.connection
      .getRepository(RCPTEntity)
      .createQueryBuilder()
      .select('AVG(amount)', 'avg')
      .andWhere('filer_naml = :committeeName', { committeeName })
      .andWhere('rec_type = :recType', { recType: 'RCPT' })
      .andWhere('form_type IN (:...formType)', { formType: this.RCPTTypes })
      .getRawOne();

    return parseInt(contributionAvg).toString();
  }

  async getAverageDonation(filerName: string) {
    return await this.getContributionAvg(filerName);
  }

  async getRaisedIndividualSum(committeeName: string) {
    const { sum } = await this.connection
      .getRepository(RCPTEntity)
      .createQueryBuilder()
      .select('COALESCE(SUM(amount), 0)', 'sum')
      .andWhere('filer_naml = :committeeName', { committeeName })
      .andWhere('rec_type = :recType', { recType: 'RCPT' })
      .andWhere('form_type IN (:...formType)', { formType: this.RCPTTypes })
      .andWhere('NOT (ctrib_emp = :na AND ctrib_occ = :na)', { na: 'N/A' })
      .andWhere('NOT (ctrib_emp IS NULL AND ctrib_occ IS NULL)')
      // Individual also includes the In-Kind
      // .andWhere('NOT (ctrib_dscr iLike :spendingCode)', {
      //   spendingCode: '%In-Kind%',
      // })
      .getRawOne();

    return sum;
  }

  async getRaisedInKindSum(committeeName: string) {
    const { sum } = await this.connection
      .getRepository(RCPTEntity)
      .createQueryBuilder()
      .select('COALESCE(SUM(amount), 0)', 'sum')
      .andWhere('filer_naml = :committeeName', { committeeName })
      .andWhere('rec_type = :recType', { recType: 'RCPT' })
      .andWhere('ctrib_dscr iLike :spendingCode', {
        spendingCode: '%In-Kind%',
      })
      .getRawOne();

    return sum;
  }

  async getRaisedOtherSum(committeeName: string) {
    const { sum } = await this.connection
      .getRepository(RCPTEntity)
      .createQueryBuilder()
      .select('COALESCE(SUM(amount), 0)', 'sum')
      .andWhere('filer_naml = :committeeName', { committeeName })
      .andWhere('rec_type = :recType', { recType: 'RCPT' })
      .andWhere('form_type IN (:...formType)', { formType: this.RCPTTypes })
      .andWhere(
        new Brackets((qb) => {
          qb.where('(ctrib_emp = :na AND ctrib_occ = :na)', {
            na: 'N/A',
          }).orWhere('(ctrib_emp IS NULL AND ctrib_occ IS NULL)');
        }),
      )
      .getRawOne();

    return sum;
  }
}
