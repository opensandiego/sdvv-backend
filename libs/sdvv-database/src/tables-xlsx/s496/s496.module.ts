import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '@app/sdvv-database/shared/shared.module';
import { S496Entity } from './s496.entity';
import { S496Service } from './s496.service';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([S496Entity])],
  providers: [S496Service],
  exports: [S496Service],
})
export class S496Module {}
