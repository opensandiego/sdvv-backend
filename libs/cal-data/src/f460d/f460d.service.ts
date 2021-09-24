import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { F460DEntity } from './f460d.entity';

@Injectable()
export class F460DService {
  constructor(
    @InjectRepository(F460DEntity)
    private f460dRepository: Repository<F460DEntity>,
    private connection: Connection,
  ) {}

  async findAll(): Promise<F460DEntity[]> {
    console.log('f460dRepository findAll');

    return await this.f460dRepository.find();
  }
}
