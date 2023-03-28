import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';
import { DatabaseModule } from '@app/sdvv-database';
import { StandaloneWorkerService } from './standalone-worker.service';
import { QueueDispatchModule } from './queue.dispatch/queue.dispatch.module';
import { TransactionsXLSXModule } from './transactions.xlsx/transactions.xlsx.module';
import { ZipCodeCSVModule } from './zip.code.csv/zip.code.csv.module';
import { EFileApiModule } from './efile.api/efile.api.module';
import { ProcessDataModule } from '@app/sdvv-database/process.data/process.data.module';
import { EfileApiDataModule } from '@app/efile-api-data';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        // Object.assign(await getConnectionOptions(), {
        //   autoLoadEntities: true,
        //   entities: null,
        //   migrations: null,
        // }),
        ({
          type: 'postgres',
          url: process.env.DATABASE_URL,
          synchronize: false,
          autoLoadEntities: true,
          ssl: false,
        }),
    }),
    BullModule.forRoot({
      redis: process.env.REDIS_URL,
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('Worker', {
              prettyPrint: true,
            }),
          ),
        }),
      ],
    }),
    HttpModule,
    QueueDispatchModule,
    TransactionsXLSXModule,
    ZipCodeCSVModule,
    DatabaseModule,
    EfileApiDataModule,
    EFileApiModule,
    ProcessDataModule,
    SchedulerModule,
  ],
  providers: [StandaloneWorkerService],
  exports: [],
})
export class StandaloneWorkerModule {}
