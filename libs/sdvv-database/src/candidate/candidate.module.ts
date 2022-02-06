import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateEntity } from './candidates.entity';
import { CandidateResolver } from './candidate.resolver';
import { CandidatesResolver } from './candidates.resolver';
import { CandidateQLService } from './candidate.service';
import { CandidateAddService } from './candidate-add.service';

@Module({
  imports: [TypeOrmModule.forFeature([CandidateEntity])],
  providers: [
    CandidateResolver,
    CandidatesResolver,
    CandidateQLService,
    CandidateAddService,
  ],
  exports: [CandidateQLService, CandidateAddService],
})
export class CandidateModule {}
