import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '../shared/shared.module';
import { F460AEntity } from './f460a.entity';
import { F460AService } from './f460a.service';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([F460AEntity])],
  providers: [F460AService],
  exports: [F460AService],
})
export class F460AModule {}
