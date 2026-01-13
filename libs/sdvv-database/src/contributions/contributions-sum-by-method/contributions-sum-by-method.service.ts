import { Injectable } from '@nestjs/common';
import { Brackets, DataSource } from 'typeorm';
import { RCPTEntity } from '../../tables-xlsx/rcpt/rcpt.entity';

@Injectable()
export class ContributionsSumByMethodService {
  constructor(private dataSource: DataSource) {}

  private RCPTTypes = ['A', 'C'];
  private MonetaryContributions = ['A'];
  private NonMonetaryContributions = ['C'];

  async getMonetaryContributionsByCode({ committeeName }) {
    return await this.getContributionsByCode({
      committeeName,
      formType: this.MonetaryContributions,
    });
  }

  async getNonMonetaryContributionsByCode({ committeeName }) {
    return await this.getContributionsByCode({
      committeeName,
      formType: this.NonMonetaryContributions,
    });
  }

  private async getContributionsByCode({ committeeName, formType }) {
    const query = this.dataSource
      .getRepository(RCPTEntity)
      .createQueryBuilder()
      .select('entity_cd', 'code')
      .addSelect('COALESCE(ROUND(SUM(amount)), 0)::int', 'sum')

      .andWhere('filer_naml iLike :committeeName', { committeeName })
      .andWhere('rec_type = :recType', { recType: 'RCPT' })
      .andWhere('form_type IN (:...formType)', {
        formType: formType,
      })

      .groupBy('entity_cd');

    const results = await query.getRawMany();

    return {
      ind: this.getCodeSum('ind', results),
      com: this.getCodeSum('com', results),
      oth: this.getCodeSum('oth', results),
      pty: this.getCodeSum('pty', results),
      scc: this.getCodeSum('scc', results),
    };
  }

  private getCodeSum(code: string, sums: any[]): number {
    const codeSum = sums.find(
      (sum) => sum.code.toUpperCase() === code.toUpperCase(),
    );
    return codeSum ? codeSum.sum : 0;
  }

  // async getContributionSumNonMonetary({ committeeName }) {
  //   const query = this.dataSource
  //     .getRepository(RCPTEntity)
  //     .createQueryBuilder()
  //     .select('COALESCE(ROUND(SUM(amount)), 0)::int', 'sum')

  //     .andWhere('filer_naml iLike :committeeName', { committeeName })
  //     .andWhere('rec_type = :recType', { recType: 'RCPT' })
  //     .andWhere('form_type IN (:...formType)', {
  //       formType: this.NonMonetaryContributions,
  //     });

  //   const { sum } = await query.getRawOne();
  //   return sum;
  // }

  async getContributionsInKindSum({ committeeName }) {
    const query = this.dataSource
      .getRepository(RCPTEntity)
      .createQueryBuilder()
      .select('COALESCE(ROUND(SUM(amount)), 0)::int', 'sum')

      .andWhere('filer_naml iLike :committeeName', { committeeName })
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
    const query = this.dataSource
      .getRepository(RCPTEntity)
      .createQueryBuilder()
      .select('COALESCE(ROUND(SUM(amount)), 0)::int', 'sum')

      .andWhere('filer_naml iLike :committeeName', { committeeName })
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
    const query = this.dataSource
      .getRepository(RCPTEntity)
      .createQueryBuilder()
      .select('COALESCE(ROUND(SUM(amount)), 0)::int', 'sum')

      .andWhere('filer_naml iLike :committeeName', { committeeName })
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
