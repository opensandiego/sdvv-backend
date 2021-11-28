import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ZipCodeCSVModule } from '../zip.code.csv/zip.code.csv.module';
import { TransactionsXLSXModule } from '../transactions.xlsx/transactions.xlsx.module';
import { ProcessDataModule } from '@app/sdvv-database/process.data/process.data.module';
import { EFileApiModule } from '../efile.api/efile.api.module';
import { QueueService } from './queue.service';
import { QueueConsumerAdd } from './queue.consumer.add';
import { QueueConsumerProcess } from './queue.consumer.process';
import { QueueConsumer } from './queue-consumer';

@Module({
  imports: [
    TransactionsXLSXModule,
    ZipCodeCSVModule,
    ProcessDataModule,
    EFileApiModule,
    BullModule.registerQueue({
      name: 'worker-add-data',
    }),
    BullModule.registerQueue({
      name: 'worker-process-data',
    }),
    BullModule.registerQueue({
      name: 'worker-update-data',
    }),
  ],
  providers: [
    QueueService,
    QueueConsumerAdd,
    QueueConsumerProcess,
    QueueConsumer,
  ],
  exports: [QueueConsumerAdd, QueueConsumerProcess, QueueConsumer],
})
export class QueueDispatchModule {}
