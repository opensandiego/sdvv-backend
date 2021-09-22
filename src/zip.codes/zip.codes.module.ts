import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZipCodeEntity } from './zip.codes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ZipCodeEntity])],
  providers: [],
  controllers: [],
})
export class ZipCodesModule {}
