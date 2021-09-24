import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

@Injectable()
export class SharedService {
  constructor(private connection: Connection) {}

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
      console.log('Error creating bulk data in database');
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
