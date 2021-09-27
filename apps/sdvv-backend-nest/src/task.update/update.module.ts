import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { join } from 'path';
import { HttpModule } from '@nestjs/axios';
import { UpdateController } from './update.controller';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'update-tasks',
      // processors: [join(__dirname, 'update.processor.js')],
    }),
    BullModule.registerQueue({
      name: 'worker',
    }),
    HttpModule,
  ],
  controllers: [UpdateController],
})
export class UpdateModule {}
