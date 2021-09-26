import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SharedService } from '../shared/shared.service';
import { CreateF460DDto } from './dto/createF460D.dto';
import { F460DEntity } from './f460d.entity';

@Injectable()
export class F460DService {
  constructor(
    @InjectRepository(F460DEntity)
    private f460dRepository: Repository<F460DEntity>,
    private sharedService: SharedService,
  ) {}

  async findAll(): Promise<F460DEntity[]> {
    console.log('f460dRepository findAll');

    return await this.f460dRepository.find();
  }

  async createBulk(createF460DDto: CreateF460DDto[]): Promise<void> {
    await this.sharedService.createBulkData(createF460DDto, F460DEntity);
  }
}
