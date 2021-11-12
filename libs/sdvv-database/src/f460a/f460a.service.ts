import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SharedService } from '../shared/shared.service';
import { CreateF460ADto } from './f460a.dto';
import { F460AEntity } from './f460a.entity';

@Injectable()
export class F460AService {
  constructor(
    @InjectRepository(F460AEntity)
    private f460aRepository: Repository<F460AEntity>,
    private sharedService: SharedService,
  ) {}

  async findAll(): Promise<F460AEntity[]> {
    console.log('f460aRepository findAll');

    return await this.f460aRepository.find();
  }

  async createBulk(createF460ADto: CreateF460ADto[]): Promise<void> {
    await this.sharedService.createBulkData(createF460ADto, F460AEntity);
  }
}
