import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElectionEntity } from './entity/elections.entity';
import { CandidateEntity } from './entity/candidates.entity';
import { CommitteeEntity } from './entity/committees.entity';
import { TablesService } from './tables.sevice';

@Module({
  imports: [
    TypeOrmModule.forFeature([ElectionEntity]),
    TypeOrmModule.forFeature([CommitteeEntity]),
    TypeOrmModule.forFeature([CandidateEntity]),
  ],
  providers: [TablesService],
  exports: [],
})
export class TablesModule {}
