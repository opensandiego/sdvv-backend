import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { HttpModule } from '@nestjs/axios';
import { ProcessFilingService } from './process.filing.service';
import { FilingsController } from './process.filing.controller';
import { ProcessCandidateCommitteeService } from './process.committee.service';
import { ProcessCommitteeService } from './process.committee.processor.service';
import { TaskCommitteeController } from './process.committee.controller';
import { FilingProcessor } from './process.filing.processor';

@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: 'process-filing',
      },
      {
        name: 'process-committee',
      },
    ),
    HttpModule,
  ],
  providers: [
    ProcessFilingService,
    ProcessCandidateCommitteeService,
    ProcessCommitteeService,
    FilingProcessor,
  ],
  controllers: [FilingsController, TaskCommitteeController],
})
export class ProcessModule {}
