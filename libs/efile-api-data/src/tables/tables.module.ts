import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElectionEntity } from './entity/elections.entity';
import { CommitteeEntity } from './entity/committees.entity';
import { TablesService } from './tables.sevice';

@Module({
  imports: [
    TypeOrmModule.forFeature([ElectionEntity]),
    TypeOrmModule.forFeature([CommitteeEntity]),
  ],
  providers: [TablesService],
  exports: [],
})
export class TablesModule {}
