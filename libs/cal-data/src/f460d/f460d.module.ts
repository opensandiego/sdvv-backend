import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { F460DEntity } from './f460d.entity';
import { F460DService } from './f460d.service';

@Module({
  imports: [TypeOrmModule.forFeature([F460DEntity])],
  providers: [F460DService],
  exports: [F460DService],
})
export class F460DModule {}
