import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommitteeEntity } from './committees.entity';
import { CreateCommitteeDto } from './dto/createCommittee.dto';
// import { UpdateCommitteeDto } from './dto/updateCommittee.dto';

@Injectable()
export class CommitteesService {
  constructor(
    @InjectRepository(CommitteeEntity)
    private committeesRepository: Repository<CommitteeEntity>,
  ) {}

  findAll(): Promise<CommitteeEntity[]> {
    return this.committeesRepository.find();
  }

  findOne(id: string): Promise<CommitteeEntity> {
    return this.committeesRepository.findOne(id);
  }

  async create(committee: CreateCommitteeDto) {
    return await this.committeesRepository.save(committee);
  }

  async createBulk(committee: CreateCommitteeDto[]) {
    return await this.committeesRepository.save(committee);
  }

  // async update(
  //   id: string,
  //   committee: UpdateCommitteeDto,
  // ): Promise<CommitteeEntity> {
  //   return await this.committeesRepository.save({
  //     entity_id: id,
  //     ...committee,
  //   });
  // }

  // async remove(id: string): Promise<void> {
  //   await this.committeesRepository.delete(id);
  // }
}
