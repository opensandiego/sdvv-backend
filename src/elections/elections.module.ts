import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElectionsService } from './elections.service';
import { ElectionsController } from './elections.controller';
import { ElectionEntity } from './elections.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ElectionEntity])],
  providers: [ElectionsService],
  controllers: [ElectionsController],
})
export class ElectionsModule {}
