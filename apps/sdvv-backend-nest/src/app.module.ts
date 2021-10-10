import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { getConnectionOptions } from 'typeorm';
import { ChartDataModule } from './chart.data/chart.data.module';
import { QueueProducerModule } from './queue.producer/queue.producer.module';
import { EfileApiDataModule } from '@app/efile-api-data';
import { APIModule } from './api/api.module';
import { DatabaseModule } from '@app/sdvv-database';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          autoLoadEntities: true,
          entities: null,
          migrations: null,
        }),
    }),
    BullModule.forRoot({
      redis: process.env.REDIS_URL,
      // redis: {
      //   host: 'localhost',
      //   port: 6379,
      // },
    }),
    EfileApiDataModule,
    DatabaseModule,
    ChartDataModule,
    QueueProducerModule,
    APIModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
