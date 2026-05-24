import { Injectable } from '@nestjs/common';
import { DataSource, DeleteResult, Brackets } from 'typeorm';
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

  public async flagDuplicateLateExpenditures() {
    const s496Repository = this.dataSource.getRepository(S496Entity);

    // 1. Get list of a unique filers (filer name, filer id) in s496
    const filerNamesQuery = s496Repository
      .createQueryBuilder('s496')
      .select('LOWER(s496.filer_naml)', 'filer_naml_lower')
      // get the unique filer ids that are numeric strings into an array
      .addSelect(
        `COALESCE(ARRAY_AGG(DISTINCT s496.filer_id) FILTER (WHERE s496.filer_id ~ '^[0-9]+$'), '{}')`,
        'filer_ids',
      )
      .groupBy('LOWER(s496.filer_naml)');

    const rawFilers = (await filerNamesQuery.getRawMany()) as {
      filer_naml_lower: string;
      filer_ids: string[];
    }[];

    const filers = rawFilers.map((filer) => ({
      ...filer,
      filer_id: filer.filer_ids[0],
    }));

    const expnRepository = this.dataSource.getRepository(EXPNEntity);

    // 2. For each filer look for their 460D transactions in expn
    for await (const filer of filers) {
      const { filer_naml_lower: filerName, filer_id: filerId } = filer;

      // 2-1 get the max thru date for the filer's transactions
      const expnQuery = expnRepository
        .createQueryBuilder('expn')
        .select('MAX(expn.thru_date)', 'max_thru_date')
        .where('expn.form_type = :formTypeEXPN', {
          formTypeEXPN: 'D',
        })
        .addSelect("LOWER(TRIM(COALESCE(expn.filer_naml, '')))")
        // Multiple filer names may have the same filerId 
        // but not all transactions/filings have a filerId
        // filers with the same filerId may use one name for a 
        // 496 filing and a different name for a 460 filing
        // this looks for both filer name and filer id matching
        .andWhere(
          new Brackets((qb) => {
            qb.where(
              "LOWER(TRIM(COALESCE(expn.filer_naml, ''))) = :s496FilerName",
              {
                s496FilerName: filerName,
              },
            ).orWhere('expn.filer_id = :filerId', {
              filerId: filerId,
            });
          }),
        )
        .groupBy("LOWER(TRIM(COALESCE(expn.filer_naml, '')))");

      const expnRow = (await expnQuery.getRawOne()) as {
        max_thru_date: string;
      };

      if (!expnRow) continue;
      const { max_thru_date: maxThruDate } = expnRow;

      // 2-1 For any of the filer's s496 transactions that are on or older then
      // the max thru date set is_duplicate to TRUE
      const s496Update = s496Repository
        .createQueryBuilder('s496')
        .update(S496Entity)
        .set({ is_duplicate: true })
        .andWhere(
          "LOWER(TRIM(COALESCE(s496.filer_naml, ''))) = :s496FilerName",
          {
            s496FilerName: filerName,
          },
        )
        .andWhere('s496.exp_date <= :maxThruDate ', {
          maxThruDate: maxThruDate,
        });

      await s496Update.execute();

      // 2-2 For any of the filer's s496 transactions that are newer then
      // the max thru date set is_duplicate to FALSE.
      await s496Repository
        .createQueryBuilder('s496')
        .update(S496Entity)
        .set({ is_duplicate: false })
        .andWhere(
          "LOWER(TRIM(COALESCE(s496.filer_naml, ''))) = :s496FilerName",
          {
            s496FilerName: filerName,
          },
        )
        .andWhere('s496.exp_date > :maxThruDate ', {
          maxThruDate: maxThruDate,
        })
        .execute();

      // Setting is_duplicate to FALSE useful when researching the transaction
      // data in a database viewer. When the value is NULL then there was
      // no associated filer in expn found for the transaction's filer.
    }
  }

  /** @deprecated use flagDuplicateLateExpenditures */
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
    return 0;
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
