import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElectionEntity } from './elections.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ElectionEntity])],
})
export class ElectionsModule {}
