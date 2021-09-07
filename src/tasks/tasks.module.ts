import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { join } from 'path';
import { HttpModule } from '@nestjs/axios';
import { TasksController } from './tasks.controller';
import { EFileDownloadService } from './efile.download.service';
import { CandidateCommitteeService } from './candidate.committee.service';
import { ComputeProcessorService } from './compute.processor.service';

@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: 'compute-tasks',
      },
      {
        name: 'update-tasks',
        processors: [join(__dirname, 'update.processor.js')],
      },
    ),
    HttpModule,
  ],
  providers: [
    EFileDownloadService,
    CandidateCommitteeService,
    ComputeProcessorService,
  ],
  controllers: [TasksController],
})
export class TasksModule {}
