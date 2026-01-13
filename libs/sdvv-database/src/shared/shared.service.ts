import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class SharedService {
  constructor(private dataSource: DataSource) {}

  public async createBulkData(dataTypeArray: any[], Entity) {
    const queryRunner = this.dataSource.createQueryRunner();
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
    const queryRunner = this.dataSource.createQueryRunner();

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
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
