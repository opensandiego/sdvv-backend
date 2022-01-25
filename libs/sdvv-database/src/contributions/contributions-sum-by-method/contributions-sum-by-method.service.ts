import { Injectable } from '@nestjs/common';
import { Brackets, Connection } from 'typeorm';
import { RCPTEntity } from '../../tables-xlsx/rcpt/rcpt.entity';

@Injectable()
export class ContributionsSumByMethodService {
  constructor(private connection: Connection) {}

  private RCPTTypes = ['A', 'C'];
  private NonMonetaryContributions = ['C'];

  async getContributionsInKindSum({ committeeName }) {
    const query = this.connection
      .getRepository(RCPTEntity)
      .createQueryBuilder()
      .select('COALESCE(ROUND(SUM(amount)), 0)::int', 'sum')

      .andWhere('filer_naml = :committeeName', { committeeName })
      .andWhere('rec_type = :recType', { recType: 'RCPT' })
      .andWhere('form_type IN (:...formType)', {
        formType: this.NonMonetaryContributions,
      })

      .andWhere('ctrib_dscr iLike :spendingCode', {
        spendingCode: '%In-Kind%',
      });

    const { sum } = await query.getRawOne();
    return sum;
  }

  async getContributionsIndividualSum({ committeeName }) {
    const query = this.connection
      .getRepository(RCPTEntity)
      .createQueryBuilder()
      .select('COALESCE(ROUND(SUM(amount)), 0)::int', 'sum')

      .andWhere('filer_naml = :committeeName', { committeeName })
      .andWhere('rec_type = :recType', { recType: 'RCPT' })
      .andWhere('form_type IN (:...formType)', { formType: this.RCPTTypes })

      .andWhere('NOT (ctrib_emp = :na AND ctrib_occ = :na)', { na: 'N/A' })
      .andWhere('NOT (ctrib_emp IS NULL AND ctrib_occ IS NULL)');
    // Individual also includes the In-Kind
    // .andWhere('NOT (ctrib_dscr iLike :spendingCode)', {
    //   spendingCode: '%In-Kind%',
    // })
    // Should Individual contributions exclude In-Kind?

    const { sum } = await query.getRawOne();
    return sum;
  }

  async getContributionsOtherSum({ committeeName }) {
    const query = this.connection
      .getRepository(RCPTEntity)
      .createQueryBuilder()
      .select('COALESCE(ROUND(SUM(amount)), 0)::int', 'sum')

      .andWhere('filer_naml = :committeeName', { committeeName })
      .andWhere('rec_type = :recType', { recType: 'RCPT' })
      .andWhere('form_type IN (:...formType)', { formType: this.RCPTTypes })

      // This includes the contributions that are excluded from individual
      .andWhere(
        new Brackets((qb) => {
          qb.where('(ctrib_emp = :na AND ctrib_occ = :na)', {
            na: 'N/A',
          }).orWhere('(ctrib_emp IS NULL AND ctrib_occ IS NULL)');
        }),
      );

    const { sum } = await query.getRawOne();
    return sum;
  }
}
