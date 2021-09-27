import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateEntity } from './candidates.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CandidateEntity])],
})
export class CandidatesModule {}
