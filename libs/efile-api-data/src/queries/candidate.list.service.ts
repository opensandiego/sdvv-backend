import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { CandidateSummaryService } from './candidate.summary.service';
import { RCPTEntity } from '@app/sdvv-database/tables-xlsx/rcpt/rcpt.entity';
import { EXPNEntity } from '@app/sdvv-database/tables-xlsx/expn/expn.entity';

@Injectable()
export class CandidateListService {
  constructor(
    private connection: Connection,
    private candidateSummaryService: CandidateSummaryService,
  ) {}

  // private RCPTTypes = ['A', 'C', 'I', 'F496P3'];
  private RCPTTypes = ['A', 'C', 'I'];
  private EXPNTypes = ['E'];

  async getContributionByOccupation(committeeName: string, limit = 20) {
    const groups = await this.connection
      .getRepository(RCPTEntity)
      .createQueryBuilder()
      .select('ctrib_occ', 'name')
      .addSelect('SUM(amount)', 'amount')
      .andWhere('filer_naml = :committeeName', { committeeName })
      // .addSelect('COUNT( DISTINCT name)', 'uniqueContributorCount')
      .andWhere('rec_type = :recType', { recType: 'RCPT' })
      .andWhere('form_type IN (:...formType)', { formType: this.RCPTTypes })
      .andWhere('ctrib_occ NOT IN (:...excludedOccupations)', {
        excludedOccupations: ['N/A'],
      })
      .groupBy('ctrib_occ')
      .orderBy('amount', 'DESC')
      .limit(limit)
      .getRawMany();

    return groups;
  }

  async getContributionByEmployer(committeeName: string, limit = 20) {
    const groups = await this.connection
      .getRepository(RCPTEntity)
      .createQueryBuilder()
      .select('ctrib_emp', 'name')
      .addSelect('SUM(amount)', 'amount')
      // .addSelect('COUNT( DISTINCT name)', 'uniqueContributorCount')
      .andWhere('filer_naml = :committeeName', { committeeName })
      .andWhere('rec_type = :recType', { recType: 'RCPT' })
      .andWhere('form_type IN (:...formType)', { formType: this.RCPTTypes })
      .andWhere('(ctrib_emp IS NOT NULL)')
      .andWhere('ctrib_emp NOT IN (:...excluded)', {
        excluded: ['N/A', 'n/a', 'None'],
      })
      .groupBy('ctrib_emp')
      .orderBy('amount', 'DESC')
      .limit(limit)
      .getRawMany();

    return groups;
  }

  async getContributionByName(committeeName: string, limit = 20) {
    const groups = await this.connection
      .getRepository(RCPTEntity)
      .createQueryBuilder()
      .select('name')
      .addSelect('SUM(amount)', 'sum')
      .andWhere('filer_naml = :committeeName', { committeeName })
      .andWhere('rec_type = :recType', { recType: 'RCPT' })
      .andWhere('form_type IN (:...formType)', { formType: this.RCPTTypes })
      .groupBy('name')
      .orderBy('sum', 'DESC')
      .limit(limit)
      .getRawMany();

    return groups;
  }

  async getContributionByIntrName(committeeName: string, limit = 20) {
    const groups = await this.connection
      .getRepository(RCPTEntity)
      .createQueryBuilder()
      .select('intr_name')
      .addSelect('SUM(amount)', 'sum')
      // .addSelect('COUNT( DISTINCT name)', 'uniqueContributorCount')
      .andWhere('filer_naml = :committeeName', { committeeName })
      .andWhere('rec_type = :recType', { recType: 'RCPT' })
      .andWhere('form_type IN (:...formType)', { formType: this.RCPTTypes })
      .groupBy('intr_naml')
      .orderBy('sum', 'DESC')
      .limit(limit)
      .getRawMany();

    return groups;
  }

  // CandidateSpendingListService
  async getExpenseBySpendingCode(committeeName: string, limit = 20) {
    const totalSpent = await this.candidateSummaryService.getSpentSum(
      committeeName,
    );

    const groups = await this.connection
      .getRepository(EXPNEntity)
      .createQueryBuilder()
      .select('expn_code', 'spending_code')
      .addSelect('SUM(amount)', 'sum')
      .addSelect(`round(SUM(amount)::decimal * 100 / :total, 1)`, 'average')
      .setParameter('total', totalSpent)
      .andWhere('filer_naml = :committeeName', { committeeName })
      .andWhere('rec_type = :recType', { recType: 'EXPN' })
      .andWhere('form_type IN (:...formType)', { formType: this.EXPNTypes })
      .groupBy('expn_code')
      .orderBy('sum', 'DESC')
      .limit(limit)
      .getRawMany();

    return groups;
  }
}
