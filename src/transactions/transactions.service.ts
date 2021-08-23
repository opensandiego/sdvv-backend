import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionEntity } from './transactions.entity';
import { CreateTransactionDto } from './dto/createTransaction.dto';
import { UpdateTransactionDto } from './dto/updateTransaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(TransactionEntity)
    private transactionRepository: Repository<TransactionEntity>,
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
    return await this.transactionRepository.save(createTransactionDto);
  }

  async update(
    filingID: string,
    tranID: string,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<TransactionEntity> {
    return await this.transactionRepository.save({
      filing_id: filingID,
      tran_id: tranID,
      ...updateTransactionDto,
      transaction_date_time: new Date(
        updateTransactionDto.transaction_date,
      ).toISOString(),
    });
  }

  async remove(filingID: string, tranID: string): Promise<void> {
    await this.transactionRepository.delete({
      filing_id: filingID,
      tran_id: tranID,
    });
  }
}
