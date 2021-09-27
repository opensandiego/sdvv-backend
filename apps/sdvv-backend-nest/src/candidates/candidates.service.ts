import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CandidateEntity } from './candidates.entity';
// import { CreateCandidateDto } from './dto/createCandidate.dto';
// import { UpdateCandidateDto } from './dto/updateCandidate.dto';

@Injectable()
export class CandidatesService {
  constructor(
    @InjectRepository(CandidateEntity)
    private candidateRepository: Repository<CandidateEntity>,
  ) {}

  findAll(): Promise<CandidateEntity[]> {
    return this.candidateRepository.find();
  }

  findOne(id: string): Promise<CandidateEntity> {
    return this.candidateRepository.findOne(id);
  }

  // async create(createCandidateDto: CreateCandidateDto) {
  //   return await this.candidateRepository.save(createCandidateDto);
  // }

  // async createBulk(createCandidateDto: CreateCandidateDto[]) {
  //   return await this.candidateRepository.save(createCandidateDto);
  // }

  // async update(
  //   id: string,
  //   updateCandidateDto: UpdateCandidateDto,
  // ): Promise<CandidateEntity> {
  //   return await this.candidateRepository.save({
  //     coe_id: id,
  //     ...updateCandidateDto,
  //   });
  // }

  // async remove(id: string): Promise<void> {
  //   await this.candidateRepository.delete(id);
  // }
}
