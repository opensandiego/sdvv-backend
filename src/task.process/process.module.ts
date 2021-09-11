import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { HttpModule } from '@nestjs/axios';
import { ProcessCandidateCommitteeService } from './process.committee.service';
import { ComputeProcessorService } from './process.committee.processor.service';
import { TaskCommitteeController } from './process.committee.controller';

@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: 'process-committee',
      },
    ),
    HttpModule,
  ],
  providers: [
    ProcessCandidateCommitteeService,
    ComputeProcessorService,
  ],
  controllers: [TaskCommitteeController],
})
export class ProcessModule {}
