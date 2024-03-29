import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TerminusModule } from '@nestjs/terminus';
import { ZipCodeCSVModule } from '../zip.code.csv/zip.code.csv.module';
import { TransactionsXLSXModule } from '../transactions.xlsx/transactions.xlsx.module';
import { ProcessDataModule } from '@app/sdvv-database/process.data/process.data.module';
import { EFileApiModule } from '../efile.api/efile.api.module';
import { QueueService } from './queue.service';
import { QueueConsumer } from './queue-consumer';
import { ShutdownService } from './shutdown.service';

@Module({
  imports: [
    TerminusModule,
    TransactionsXLSXModule,
    ZipCodeCSVModule,
    ProcessDataModule,
    EFileApiModule,
    BullModule.registerQueue({
      name: 'worker-update-data',
    }),
  ],
  providers: [QueueService, QueueConsumer, ShutdownService],
  exports: [QueueConsumer],
})
export class QueueDispatchModule {}
