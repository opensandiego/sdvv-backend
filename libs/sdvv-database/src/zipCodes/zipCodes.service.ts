import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SharedService } from '../shared/shared.service';
import { CreateZipCodeDto } from './dto/createZipCode.dto';
import { ZipCodeEntity } from './zipCodes.entity';

@Injectable()
export class ZipCodesService {
  constructor(
    @InjectRepository(ZipCodeEntity)
    private zipCodeRepository: Repository<ZipCodeEntity>,
    private sharedService: SharedService,
  ) {}

  async findAll(): Promise<ZipCodeEntity[]> {
    return await this.zipCodeRepository.find();
  }

  async createBulkZipCode(createZipCodeDto: CreateZipCodeDto[]): Promise<void> {
    await this.sharedService.createBulkData(createZipCodeDto, ZipCodeEntity);
  }
}
