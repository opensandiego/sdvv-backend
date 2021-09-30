import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { RouterModule } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmConfigService } from './config/database.config';
import { ElectionsModule } from './elections/elections.module';
import { CandidatesModule } from './candidates/candidates.module';
import { FilingsModule } from './filings/filings.module';
import { TransactionsModule } from './transactions/transactions.module';
import { CommitteesModule } from './committees/committees.module';
import { routes } from './routes';
import { UpdateModule } from './task.update/update.module';
import { ProcessModule } from './task.process/process.module';
import { ChartDataModule } from './chart.data/chart.data.module';
import { CalModule } from './cal.format/cal.module';
import { QueueProducerModule } from './queue.producer/queue.producer.module';
import { EfileApiDataModule } from '@app/efile-api-data';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    EfileApiDataModule,
    ElectionsModule,
    CandidatesModule,
    FilingsModule,
    TransactionsModule,
    CommitteesModule,
    ChartDataModule,
    UpdateModule,
    ProcessModule,
    RouterModule.register(routes),
    CalModule,
    QueueProducerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
