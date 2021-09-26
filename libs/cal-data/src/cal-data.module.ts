import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../src/config/database.config';
import { CalDataService } from './cal-data.service';
import { F460DModule } from './f460d/f460d.module';
import { ZipCodesModule } from './zipCodes/zipCodes.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    ZipCodesModule,
    F460DModule,
  ],
  providers: [CalDataService],
  exports: [CalDataService],
})
export class CalDataModule {}
