import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { F460DEntity } from './entity/f460d.entity';

@Injectable()
export class CalService {
  constructor(
    @InjectRepository(F460DEntity)
    private transactionRepository: Repository<F460DEntity>,
    private connection: Connection,
  ) {}
}
