import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { QueueDispatchConsumer } from './queue.dispatch.consumer';
import { ZipCodeCSVModule } from '../zip.code.csv/zip.code.csv.module';
import { TransactionsXLSXModule } from '../transactions.xlsx/transactions.xlsx.module';

@Module({
  imports: [
    TransactionsXLSXModule,
    ZipCodeCSVModule,
    BullModule.forRoot({
      // configure this for production
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'worker',
    }),
  ],
  providers: [QueueDispatchConsumer],
  exports: [QueueDispatchConsumer],
})
export class QueueDispatchModule {}
