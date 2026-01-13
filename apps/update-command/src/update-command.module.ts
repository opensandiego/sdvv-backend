import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerminusModule } from '@nestjs/terminus';

import { ProcessDataModule } from '@app/sdvv-database/process.data/process.data.module';
import { TransactionsXLSXModule } from './transactions.xlsx/transactions.xlsx.module';
import { ZipCodeCSVModule } from './zip.code.csv/zip.code.csv.module';
import { EFileApiModule } from './efile.api/efile.api.module';
import { UpdateCommandService } from './update-command.service';

import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        synchronize: false,
        autoLoadEntities: true,
        ssl:
          process.env.NODE_ENV === 'production'
            ? {
                rejectUnauthorized: false,
              }
            : false,
      }),
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('Update Command', {
              prettyPrint: true,
            }),
          ),
        }),
      ],
    }),
    ProcessDataModule,
    EFileApiModule,
    TerminusModule,
    TransactionsXLSXModule,
    ZipCodeCSVModule,
  ],
  providers: [UpdateCommandService],
})
export class UpdateCommandModule {}
