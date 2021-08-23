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

  findOne(id: number): Promise<TransactionEntity> {
    return this.transactionRepository.findOne(id);
  }

  async create(createTransactionDto: CreateTransactionDto) {
    return await this.transactionRepository.save(createTransactionDto);
  }

  async createBulk(createTransactionDto: CreateTransactionDto[]) {
    return await this.transactionRepository.save(createTransactionDto);
  }

  async update(
    id: number,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<TransactionEntity> {
    return await this.transactionRepository.save({
      id: id,
      ...updateTransactionDto,
    });
  }

  async remove(id: number): Promise<void> {
    await this.transactionRepository.delete(id);
  }
}
