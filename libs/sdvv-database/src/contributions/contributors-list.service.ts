import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { RCPTEntity } from '../tables-xlsx/rcpt/rcpt.entity';
import { ContributionsService } from './contributions.service';

@Injectable()
export class ContributorsListService {
  constructor(
    private connection: Connection,
    private contributionsService: ContributionsService,
  ) {}

  private RCPTTypes = ['A', 'C', 'I'];

  async getContributionsByOccupation({ committeeName, limit = 20 }) {
    const totalContributions =
      await this.contributionsService.getContributionSum({
        committeeName: committeeName,
      });

    if (totalContributions === 0) {
      return [];
    }

    const query = this.connection
      .getRepository(RCPTEntity)
      .createQueryBuilder()
      .select('ctrib_occ', 'occupation')
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
}
