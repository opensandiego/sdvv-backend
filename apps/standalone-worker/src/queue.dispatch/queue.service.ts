import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class QueueService implements OnModuleInit {
  constructor(
    @InjectQueue('worker-update-data') private workerProcessUpdateQueue: Queue,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async onModuleInit() {
    // The use of a not comparison is to retain existing functionality
    //   when the env. var. does not exist.
    if (process.env.DISABLE_QUEUE_PURGE?.toLocaleLowerCase() !== 'true') {
      await this.workerProcessUpdateQueue.empty().then(() =>
        this.logger.log({
          level: 'info',
          message: 'Queue emptied',
          queue: 'worker-update-data',
        }),
      );
    }

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
