import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class QueueService implements OnModuleInit {
  constructor(
    @InjectQueue('worker-add-data') private workerAddDataQueue: Queue,
    @InjectQueue('worker-process-data') private workerProcessDataQueue: Queue,
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
  }
}