import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmConfigService } from './config/database.config';
import { DatabaseModule } from '@app/sdvv-database';
import { StandaloneWorkerService } from './standalone-worker.service';
import { QueueDispatchModule } from './queue.dispatch/queue.dispatch.module';
import { TransactionsXLSXModule } from './transactions.xlsx/transactions.xlsx.module';
import { F460DModule } from '@app/sdvv-database/f460d/f460d.module';
import { ZipCodeCSVModule } from './zip.code.csv/zip.code.csv.module';
import { QueueDispatchModule } from './queue.dispatch/queue.dispatch.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    BullModule.forRoot({
      // configure this for production
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    HttpModule,
  ],
  providers: [StandaloneWorkerService],
  exports: [],
})
export class StandaloneWorkerModule {}
