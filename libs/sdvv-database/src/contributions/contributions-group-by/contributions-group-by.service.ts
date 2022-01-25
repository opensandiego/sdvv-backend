import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { RCPTEntity } from '../../tables-xlsx/rcpt/rcpt.entity';
import { ContributionsDetailsService } from '../contributions-details/contributions-details.service';

@Injectable()
export class ContributionsGroupByService {
  constructor(
    private connection: Connection,
    private contributionsDetailsService: ContributionsDetailsService,
  ) {}

  private RCPTTypes = ['A', 'C'];

  async getContributionsByOccupation({ committeeName, limit = 20 }) {
    const totalContributions =
      await this.contributionsDetailsService.getContributionSum({
        committeeName: committeeName,
      });

    if (totalContributions === 0) {
      return [];
    }

    const query = this.connection
      .getRepository(RCPTEntity)
      .createQueryBuilder()
      .select('ctrib_occ', 'name')
      .addSelect('COALESCE(ROUND(SUM(amount)), 0)::int', 'sum')

      .addSelect(`ROUND(SUM(amount)::decimal / :total * 100, 2)`, 'percent')
      .setParameter('total', totalContributions)

      // This is intended to count the numbers contributors within each
      //  occupation group by combining the last and first names.
      // The result of this field needs to be checked for accuracy.
      .addSelect('COUNT(DISTINCT CONCAT(ctrib_naml, ctrib_namf))', 'count')

      .andWhere('filer_naml = :committeeName', { committeeName })
      .andWhere('rec_type = :recType', { recType: 'RCPT' })
      .andWhere('form_type IN (:...formType)', { formType: this.RCPTTypes })

      .andWhere('ctrib_occ NOT IN (:...excludedOccupations)', {
        excludedOccupations: ['N/A'],
      })
      .groupBy('ctrib_occ')
      .orderBy('sum', 'DESC');

    if (limit > 0) {
      query.limit(limit);
    }

    const groups = await query.getRawMany();
    return groups;
  }

  async getContributionByEmployer({ committeeName, limit = 20 }) {
    const totalContributions =
      await this.contributionsDetailsService.getContributionSum({
        committeeName: committeeName,
      });

    if (totalContributions === 0) {
      return [];
    }

    const query = this.connection
      .getRepository(RCPTEntity)
      .createQueryBuilder()
      .select('ctrib_emp', 'name')
      .addSelect('COALESCE(ROUND(SUM(amount)), 0)::int', 'sum')

      .addSelect(`ROUND(SUM(amount)::decimal / :total * 100, 2)`, 'percent')
      .setParameter('total', totalContributions)

      .addSelect('COUNT(DISTINCT CONCAT(ctrib_naml, ctrib_namf))', 'count')

      .andWhere('filer_naml = :committeeName', { committeeName })
      .andWhere('rec_type = :recType', { recType: 'RCPT' })
      .andWhere('form_type IN (:...formType)', { formType: this.RCPTTypes })

      .andWhere('(ctrib_emp IS NOT NULL)')
      .andWhere('ctrib_emp NOT IN (:...excluded)', {
        excluded: ['N/A', 'n/a', 'None'],
      })
      .groupBy('ctrib_emp')
      .orderBy('sum', 'DESC');

    if (limit > 0) {
      query.limit(limit);
    }

    const groups = await query.getRawMany();
    return groups;
  }

  async getContributionByZip({ committeeName, limit = 20 }) {
    const totalContributions =
      await this.contributionsDetailsService.getContributionSum({
        committeeName: committeeName,
      });

    if (totalContributions === 0) {
      return [];
    }

    const query = this.connection
      .getRepository(RCPTEntity)
      .createQueryBuilder()
      .select('ctrib_zip4', 'name')
      .addSelect('COALESCE(ROUND(SUM(amount)), 0)::int', 'sum')

      .addSelect(`ROUND(SUM(amount)::decimal / :total * 100, 2)`, 'percent')
      .setParameter('total', totalContributions)

      .addSelect('COUNT(DISTINCT CONCAT(ctrib_naml, ctrib_namf))', 'count')

      .andWhere('filer_naml = :committeeName', { committeeName })
      .andWhere('rec_type = :recType', { recType: 'RCPT' })
      .andWhere('form_type IN (:...formType)', { formType: this.RCPTTypes })

      .groupBy('ctrib_zip4')
      .orderBy('sum', 'DESC');

    if (limit > 0) {
      query.limit(limit);
    }

    const groups = await query.getRawMany();
    return groups;
  }

  // get the summary of all Contributions made to a Committee for each Contributor
  async getContributionByContributor({ committeeName, limit = 20 }) {
    const totalContributions =
      await this.contributionsDetailsService.getContributionSum({
        committeeName: committeeName,
      });

    if (totalContributions === 0) {
      return [];
    }

    const query = this.connection
      .getRepository(RCPTEntity)
      .createQueryBuilder()

      .select(`DISTINCT (CONCAT(ctrib_naml, ', ', ctrib_namf))`, 'name')
      .addSelect('COALESCE(ROUND(SUM(amount)), 0)::int', 'sum')

      .addSelect(`ROUND(SUM(amount)::decimal / :total * 100, 2)`, 'percent')
      .setParameter('total', totalContributions)

      .addSelect('COUNT(amount)', 'count')

      .andWhere('filer_naml = :committeeName', { committeeName })
      .andWhere('rec_type = :recType', { recType: 'RCPT' })
      .andWhere('form_type IN (:...formType)', { formType: this.RCPTTypes })

      .groupBy('name')
      .orderBy('sum', 'DESC');

    if (limit > 0) {
      query.limit(limit);
    }

    const groups = await query.getRawMany();
    return groups;
  }
}
