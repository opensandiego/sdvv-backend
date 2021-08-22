import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CandidateEntity } from './candidates.entity';
import { CreateCandidateDto } from './dto/createCandidate.dto';
import { UpdateCandidateDto } from './dto/updateCandidate.dto';

@Injectable()
export class CandidatesService {
  constructor(
    @InjectRepository(CandidateEntity)
    private candidateRepository: Repository<CandidateEntity>,
  ) {}

  findAll(): Promise<CandidateEntity[]> {
    return this.candidateRepository.find();
  }

  findOne(id: number): Promise<CandidateEntity> {
    return this.candidateRepository.findOne(id);
  }

  async create(createCandidateDto: CreateCandidateDto) {
    return await this.candidateRepository.save(createCandidateDto);
  }

  async createBulk(createCandidateDto: CreateCandidateDto[]) {
    return await this.candidateRepository.save(createCandidateDto);
  }

  async update(
    id: number,
    updateCandidateDto: UpdateCandidateDto,
  ): Promise<CandidateEntity> {
    return await this.candidateRepository.save({
      id: id,
      ...updateCandidateDto,
    });
  }

  async remove(id: number): Promise<void> {
    await this.candidateRepository.delete(id);
  }
}
