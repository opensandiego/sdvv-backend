import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommitteesService } from './committees.service';
import { CommitteesController } from './committees.controller';
import { CommitteeEntity } from './committees.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommitteeEntity])],
  providers: [CommitteesService],
  controllers: [CommitteesController],
})
export class CommitteesModule {}
