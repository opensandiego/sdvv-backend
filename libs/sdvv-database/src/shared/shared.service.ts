import { Inject, Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class SharedService {
  constructor(
    private connection: Connection,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  public async createBulkData(dataTypeArray: any[], Entity) {
    const queryRunner = this.connection.createQueryRunner();
    const maxTransactionsPerInsert = 1000;

    try {
      await queryRunner.connect();
      const increment = maxTransactionsPerInsert;

      for (let min = 0; min < dataTypeArray.length; min += increment) {
        await queryRunner.manager
          .getRepository(Entity)
          .createQueryBuilder()
          .insert()
          .into(Entity)
          .values(dataTypeArray.slice(min, min + increment))
          .orIgnore()
          .execute();
      }
    } catch (error) {
      this.logger.log({
        level: 'error',
        message: 'Creating bulk data in database failed',
        type: Entity['name'],
      });

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  public addYear(dataTypeArray: any[], year: string) {
    dataTypeArray.forEach((row) => {
      row['xlsx_file_year'] = year;
    });

    return dataTypeArray;
  }

  public async deleteBulkData(
    Entity,
    recType: string,
    year: string,
    formType: string,
  ) {
    const queryRunner = this.connection.createQueryRunner();

    try {
      await queryRunner.manager
        .getRepository(Entity)
        .createQueryBuilder()
        .delete()
        .where('rec_type = :recType', { recType })
        .andWhere('xlsx_file_year = :year', { year })
        .andWhere('form_type = :formType', { formType })
        .execute();
    } catch (error) {
      this.logger.log({
        level: 'error',
        message: 'Deleting rows in database failed',
        year: year,
        formType: formType,
      });

      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
