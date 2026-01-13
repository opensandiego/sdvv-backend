import { Injectable } from '@nestjs/common';
import { DataSource, DeleteResult } from 'typeorm';
import { EXPNEntity } from '../tables-xlsx/expn/expn.entity';
import { S496Entity } from '../tables-xlsx/s496/s496.entity';

interface PartialTransaction {
  filer_id: string;
  tran_id: string;
  expn_date: string;
}

@Injectable()
export class DeduplicateExpendituresService {
  constructor(private dataSource: DataSource) {}

  public async removeDuplicateIndependentExpenditures(): Promise<number> {
    const filingIds = await this.getS496FilerIds();
    const filings = await this.get460DFilings(filingIds);
    return await this.removeDuplicates(filings);
  }

  private async getS496FilerIds(): Promise<string[]> {
    const query = await this.dataSource
      .getRepository(S496Entity)
      .createQueryBuilder()
      .select('DISTINCT filer_id');

    const filers = await query.getRawMany();
    return filers.map((filer) => filer.filer_id);
  }

  private async get460DFilings(
    filingIds: string[],
  ): Promise<PartialTransaction[]> {
    if (filingIds.length < 1) return [];

    const query = await this.dataSource
      .getRepository(EXPNEntity)
      .createQueryBuilder()
      .select('filer_id')
      .addSelect('tran_id')
      .addSelect('expn_date')
      .andWhere('filer_id IN (:...filingIds)', {
        filingIds: filingIds,
      });

    const fillings: PartialTransaction[] = await query.getRawMany();
    return fillings;
  }

  private async removeDuplicates(
    filings: PartialTransaction[],
  ): Promise<number> {
    const queryRunner = this.dataSource.createQueryRunner();

    let transactionsDeleted = 0;

    try {
      await queryRunner.connect();

      for (let index = 0; index < filings.length; ++index) {
        const filing = filings[index];
        const query = queryRunner.manager
          .getRepository(S496Entity)
          .createQueryBuilder()
          .andWhere('filer_id = :filerId', {
            filerId: filing.filer_id,
          })
          .andWhere('tran_id = :tranId', {
            tranId: filing.tran_id,
          })
          .andWhere('exp_date = :expnDate', {
            expnDate: filing.expn_date,
          });

        const results: DeleteResult = await query.delete().execute();
        if (results?.affected > 0) ++transactionsDeleted;
      }
      return transactionsDeleted;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
