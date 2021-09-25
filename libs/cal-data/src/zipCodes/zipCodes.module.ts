import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '../shared/shared.module';
import { ZipCodeEntity } from './zipCodes.entity';
import { ZipCodesService } from './zipCodes.service';

@Module({
  imports: [TypeOrmModule.forFeature([ZipCodeEntity]), SharedModule],
  providers: [ZipCodesService],
  exports: [ZipCodesService],
})
export class ZipCodesModule {}
