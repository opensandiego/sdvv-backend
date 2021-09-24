import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { SharedService } from '../shared/shared.service';
import { CreateF460DDto } from './dto/createF460D.dto';
import { F460DEntity } from './f460d.entity';

@Injectable()
export class F460DService {
  constructor(
    @InjectRepository(F460DEntity)
    private f460dRepository: Repository<F460DEntity>,
    // private connection: Connection,
    private sharedService: SharedService,
  ) {}

  async findAll(): Promise<F460DEntity[]> {
    console.log('f460dRepository findAll');

    return await this.f460dRepository.find();
  }

  async createBulkF460D(createF460DDto: CreateF460DDto[]) {
    await this.sharedService.createBulkData(createF460DDto, F460DEntity);
  }
}
