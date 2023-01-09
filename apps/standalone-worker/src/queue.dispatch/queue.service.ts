import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class QueueService implements OnModuleInit {
  constructor(
    @InjectQueue('worker-update-data') private workerProcessUpdateQueue: Queue,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    const inTESTING_MODE = this.configService.get<boolean>('root.TESTING_MODE');
    if (inTESTING_MODE) {
      console.log(`Running in Testing Mode. Startup Queue Clearing: Disabled.`);
    } else {
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
