import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ElectionEntity } from './elections.entity';
import { CreateElectionDto } from './dto/createElection.dto';
import { UpdateElectionDto } from './dto/updateElection.dto';

@Injectable()
export class ElectionsService {
  constructor(
    @InjectRepository(ElectionEntity)
    private electionsRepository: Repository<ElectionEntity>,
  ) {}

  findAll(): Promise<ElectionEntity[]> {
    return this.electionsRepository.find();
  }

  findOne(id: string): Promise<ElectionEntity> {
    return this.electionsRepository.findOne(id);
  }

  async create(election: CreateElectionDto) {
    return await this.electionsRepository.save(election);
  }

  async createBulk(elections: CreateElectionDto[]) {
    return await this.electionsRepository.save(elections);
  }

  async update(
    id: string,
    election: UpdateElectionDto,
  ): Promise<ElectionEntity> {
    return await this.electionsRepository.save({
      election_id: id,
      ...election,
    });
  }

  async remove(id: string): Promise<void> {
    await this.electionsRepository.delete(id);
  }
}
