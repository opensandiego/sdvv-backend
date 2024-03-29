import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ElectionEntity } from './entity/elections.entity';
import { CommitteeEntity } from './entity/committees.entity';

@Injectable()
export class TablesService {
  constructor(
    @InjectRepository(ElectionEntity)
    private electionEntity: Repository<ElectionEntity>,
    @InjectRepository(CommitteeEntity)
    private committeeRepository: Repository<CommitteeEntity>,
  ) {}
}
