import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateEntity } from './candidates.entity';
import { CandidateResolver } from './candidate.resolver';
import { CandidatesResolver } from './candidates.resolver';
import { CandidateQLService } from './candidate.service';

@Module({
  imports: [TypeOrmModule.forFeature([CandidateEntity])],
  providers: [CandidateResolver, CandidatesResolver, CandidateQLService],
  exports: [CandidateQLService],
})
export class CandidateModule {}
