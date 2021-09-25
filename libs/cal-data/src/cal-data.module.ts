import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../src/config/database.config';
import { CalDataService } from './cal-data.service';
import { ZipCodesModule } from './zipCodes/zipCodes.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    ZipCodesModule,
  ],
  providers: [CalDataService],
  exports: [CalDataService],
})
export class CalDataModule {}
