import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { TransactionEntity } from './transactions.entity';
import { CreateTransactionDto } from './dto/createTransaction.dto';
import { UpdateTransactionDto } from './dto/updateTransaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(TransactionEntity)
    private transactionRepository: Repository<TransactionEntity>,
    private connection: Connection,
  ) {}

  findAll(): Promise<TransactionEntity[]> {
    return this.transactionRepository.find();
  }

  findOne(filingID: string, tranID: string): Promise<TransactionEntity> {
    return this.transactionRepository.findOne({
      filing_id: filingID,
      tran_id: tranID,
    });
  }

  findTransactionsFromFilling(filingID: string): Promise<TransactionEntity[]> {
    return this.transactionRepository.find({
      filing_id: filingID,
    });
  }

  async create(createTransactionDto: CreateTransactionDto) {
    return await this.transactionRepository.save(createTransactionDto);
  }

  async createBulk(createTransactionDto: CreateTransactionDto[]) {
    const queryRunner = this.connection.createQueryRunner();
    const maxTransactionsPerInsert = 1000;

    try {
      await queryRunner.connect();
      const increment = maxTransactionsPerInsert;

      for (let min = 0; min < createTransactionDto.length; min += increment) {
        queryRunner.manager
          .getRepository('transaction')
          .createQueryBuilder()
          .insert()
          .into('transaction')
          .values(createTransactionDto.slice(min, min + increment))
          .orIgnore()
          .execute();
      }
    } catch (err) {
      console.log('Error creating bulk transactions');
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async update(
    filingID: string,
    tranID: string,
    schedule: string,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<TransactionEntity> {
    return await this.transactionRepository.save({
      filing_id: filingID,
      tran_id: tranID,
      schedule: schedule,
      ...updateTransactionDto,
      transaction_date_time: new Date(
        updateTransactionDto.transaction_date,
      ).toISOString(),
    });
  }

  async remove(
    filingID: string,
    tranID: string,
    schedule: string,
  ): Promise<void> {
    await this.transactionRepository.delete({
      filing_id: filingID,
      tran_id: tranID,
      schedule: schedule,
    });
  }
}
