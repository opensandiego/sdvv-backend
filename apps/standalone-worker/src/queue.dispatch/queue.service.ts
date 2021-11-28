import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class QueueService implements OnModuleInit {
  constructor(
    @InjectQueue('worker-add-data') private workerAddDataQueue: Queue,
    @InjectQueue('worker-process-data') private workerProcessDataQueue: Queue,
    @InjectQueue('worker-update-data') private workerProcessUpdateQueue: Queue,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async onModuleInit() {
    await this.workerAddDataQueue
      .empty()
      .then((result) =>
        console.log(`Queue: 'worker-add-data' emptied`, result),
      );

    await this.workerAddDataQueue
      .getJobCounts()
      .then((counts) => console.log(`worker-add-data`, counts));

    await this.workerProcessDataQueue
      .empty()
      .then((result) =>
        console.log(`Queue: 'worker-process-data' emptied`, result),
      );

    await this.workerProcessDataQueue
      .getJobCounts()
      .then((counts) => console.log(`worker-process-data`, counts));

    await this.workerProcessUpdateQueue.empty().then(() =>
      this.logger.log({
        level: 'info',
        message: 'Queue emptied',
        queue: 'worker-update-data',
      }),
    );

    await this.workerProcessUpdateQueue.getJobCounts().then((queue) =>
      this.logger.log({
        level: 'info',
        message: 'Queue status',
        queue: 'worker-update-data',
        waiting: queue.waiting,
        completed: queue.completed,
        failed: queue.failed,
      }),
    );
  }
}
