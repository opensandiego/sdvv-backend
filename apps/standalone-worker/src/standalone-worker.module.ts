import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/database.config';
import { DatabaseModule } from '@app/sdvv-database';
import { StandaloneWorkerService } from './standalone-worker.service';
import { QueueDispatchModule } from './queue.dispatch/queue.dispatch.module';
import { TransactionsXLSXModule } from './transactions.xlsx/transactions.xlsx.module';
import { F460DModule } from '@app/sdvv-database/f460d/f460d.module';
import { ZipCodeCSVModule } from './zip.code.csv/zip.code.csv.module';
import { EFileApiModule } from './efile.api/efile.api.module';
import { ProcessDataModule } from '@app/sdvv-database/process.data/process.data.module';
import { EfileApiDataModule } from '@app/efile-api-data';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    BullModule.forRoot({
      redis: process.env.REDIS_URL,
    }),
    HttpModule,
    F460DModule,
    QueueDispatchModule,
    TransactionsXLSXModule,
    ZipCodeCSVModule,
    DatabaseModule,
    EfileApiDataModule,
    EFileApiModule,
    ProcessDataModule,
  ],
  providers: [StandaloneWorkerService],
  exports: [],
})
export class StandaloneWorkerModule {}
