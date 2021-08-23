import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilingEntity } from './filings.entity';
import { CreateFilingDto } from './dto/createFiling.dto';
import { UpdateFilingDto } from './dto/updateFiling.dto';

@Injectable()
export class FilingsService {
  constructor(
    @InjectRepository(FilingEntity)
    private filingRepository: Repository<FilingEntity>,
  ) {}

  findAll(): Promise<FilingEntity[]> {
    return this.filingRepository.find();
  }

  findOne(id: string): Promise<FilingEntity> {
    return this.filingRepository.findOne(id);
  }

  async create(createFilingDto: CreateFilingDto) {
    return await this.filingRepository.save(createFilingDto);
  }

  async createBulk(createFilingDto: CreateFilingDto[]) {
    return await this.filingRepository.save(createFilingDto);
  }

  async update(
    id: string,
    updateFilingDto: UpdateFilingDto,
  ): Promise<FilingEntity> {
    return await this.filingRepository.save({
      filing_id: id,
      ...updateFilingDto,
    });
  }

  async remove(id: string): Promise<void> {
    await this.filingRepository.delete(id);
  }
}
