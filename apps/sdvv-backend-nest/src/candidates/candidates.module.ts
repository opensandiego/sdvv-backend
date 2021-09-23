import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidatesService } from './candidates.service';
import { CandidateEntity } from './candidates.entity';
import { CandidatesController } from './candidates.controller';
@Module({
  imports: [TypeOrmModule.forFeature([CandidateEntity])],
  providers: [CandidatesService],
  controllers: [CandidatesController],
})
export class CandidatesModule {}
