import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ElectionEntity } from './entity/elections.entity';
import { CommitteeEntity } from './entity/committees.entity';
import { CandidateEntity } from './entity/candidates.entity';
import { FilingEntity } from './entity/filings.entity';
import { TransactionEntity } from './entity/transactions.entity';

@Injectable()
export class TablesService {
  constructor(
    @InjectRepository(ElectionEntity)
    private electionEntity: Repository<ElectionEntity>,
    @InjectRepository(CommitteeEntity)
    private committeeRepository: Repository<CommitteeEntity>,
    @InjectRepository(CandidateEntity)
    private candidateRepository: Repository<CandidateEntity>,
    @InjectRepository(FilingEntity)
    private filingRepository: Repository<FilingEntity>,
    @InjectRepository(TransactionEntity)
    private transactionRepository: Repository<TransactionEntity>,
  ) {}
}