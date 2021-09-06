import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { join } from 'path';
import { HttpModule } from '@nestjs/axios';
import { TasksController } from './tasks.controller';
import { EFileDownloadService } from './efile.download.service';

@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: 'tasks',
      },
      {
        name: 'update-tasks',
        processors: [join(__dirname, 'update.processor.js')],
      },
    ),
    HttpModule,
  ],
  providers: [EFileDownloadService],
  controllers: [TasksController],
})
export class TasksModule {}
