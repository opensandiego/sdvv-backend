import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ZipCodeCSVModule } from '../zip.code.csv/zip.code.csv.module';
import { TransactionsXLSXModule } from '../transactions.xlsx/transactions.xlsx.module';
import { ProcessDataModule } from '@app/sdvv-database/process.data/process.data.module';
import { EFileApiModule } from '../efile.api/efile.api.module';
import { QueueService } from './queue.service';
import { QueueConsumer } from './queue-consumer';
import { ConfigModule } from '@nestjs/config';
import { ShutdownService } from './shutdown.service';

@Module({
  imports: [
    TransactionsXLSXModule,
    ZipCodeCSVModule,
    ProcessDataModule,
    EFileApiModule,
    BullModule.registerQueue({
      name: 'worker-update-data',
    }),
    ConfigModule,
  ],
  providers: [QueueService, QueueConsumer, ShutdownService],
  exports: [QueueConsumer],
})
export class QueueDispatchModule {}
