import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CreateF460DContribIndepExpnDto } from './dto/createF460DContribIndepExpn.dto';
import { F460DEntity } from './entity/f460d.entity';

@Injectable()
export class CalService {
  constructor(
    @InjectRepository(F460DEntity)
    private f460DRepository: Repository<F460DEntity>,
    private connection: Connection,
  ) {}

  async createBulkF460D(
    createF460DContribIndepExpnDto: CreateF460DContribIndepExpnDto[],
  ) {
    await this.createBulkData(createF460DContribIndepExpnDto, F460DEntity);
  }

  private async createBulkData(dataTypeArray: any[], Entity) {
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
      console.log('Error creating bulk transactions');
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
