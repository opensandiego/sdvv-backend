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

  findProcessed(): Promise<TransactionEntity[]> {
    return this.transactionRepository.find({
      where: {
        has_been_processed: true,
      },
    });
  }

  findTransactionsFromFilling(filingID: string): Promise<TransactionEntity[]> {
    return this.transactionRepository.find({
      filing_id: filingID,
    });
  }

  // async create(createTransactionDto: CreateTransactionDto) {
  //   return await this.transactionRepository.save(createTransactionDto);
  // }

  // async createBulk(createTransactionDto: CreateTransactionDto[]) {
  //   const queryRunner = this.connection.createQueryRunner();
  //   const maxTransactionsPerInsert = 1000;

  //   try {
  //     await queryRunner.connect();
  //     const increment = maxTransactionsPerInsert;

  //     for (let min = 0; min < createTransactionDto.length; min += increment) {
  //       await queryRunner.manager
  //         .getRepository('transaction')
  //         .createQueryBuilder()
  //         .insert()
  //         .into('transaction')
  //         .values(createTransactionDto.slice(min, min + increment))
  //         .orIgnore()
  //         .execute();
  //     }
  //   } catch (err) {
  //     console.log('Error creating bulk transactions');
  //     throw err;
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

  // async updateBulkSupOpp(updateTransactionDto: UpdateTransactionDto[]) {
  //   const queryRunner = this.connection.createQueryRunner();
  //   const maxTransactionsPerInsert = 1000;

  //   try {
  //     await queryRunner.connect();
  //     const increment = maxTransactionsPerInsert;

  //     // for (let min = 0; min < createTransactionDto.length; min += increment) {
  //     //   await queryRunner.manager
  //     //     .getRepository('transaction')
  //     //     .createQueryBuilder()
  //     //     .insert()
  //     //     .into('transaction')
  //     //     .values(createTransactionDto.slice(min, min + increment))
  //     //     // .orIgnore()
  //     //     // .andUpdate()
  //     //     // .orUpdate()
  //     //     // .onConflict()
  //     //     .execute();
  //     // }
  //   } catch (err) {
  //     console.log('Error creating bulk transactions');
  //     throw err;
  //   } finally {
  //     await queryRunner.release();
  //   }

  //   // const updateTransactionDto1 = updateTransactionDto[0];
  //   // const groups = await this.connection
  //   //   .getRepository(TransactionEntity)
  //   //   .createQueryBuilder()
  //   //   .update()
  //   //   .set({ sup_opp_cd: updateTransactionDto1['sup_opp_cd'] })
  //   //   // .where('filing_id = :filingId', { filingId: '0012fa75-721b-0426-4169-fbfccc2ca5fd' })
  //   //   .where('e_filing_id = :eFilingId', {
  //   //     eFilingId: updateTransactionDto1['e_filing_id'],
  //   //   })
  //   //   .andWhere('tran_id = :tranId', {
  //   //     tranId: updateTransactionDto1['tran_id'],
  //   //   })
  //   //   .andWhere('schedule = :schedule', {
  //   //     schedule: updateTransactionDto1['schedule'],
  //   //   })
  //   //   .execute();
  // }

  // async update(
  //   filingID: string,
  //   tranID: string,
  //   schedule: string,
  //   updateTransactionDto: UpdateTransactionDto,
  // ): Promise<TransactionEntity> {
  //   return await this.transactionRepository.save({
  //     filing_id: filingID,
  //     tran_id: tranID,
  //     schedule: schedule,
  //     ...updateTransactionDto,
  //     transaction_date_time: new Date(
  //       updateTransactionDto.transaction_date,
  //     ).toISOString(),
  //   });
  // }

  // async remove(
  //   filingID: string,
  //   tranID: string,
  //   schedule: string,
  // ): Promise<void> {
  //   await this.transactionRepository.delete({
  //     filing_id: filingID,
  //     tran_id: tranID,
  //     schedule: schedule,
  //   });
  // }
}
