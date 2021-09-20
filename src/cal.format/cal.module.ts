import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { join } from 'path';
import { HttpModule } from '@nestjs/axios';
import { CalController } from './cal.controller';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'cal-tasks',
      processors: [join(__dirname, 'cal.processor.js')],
    }),
    HttpModule,
  ],
  controllers: [CalController],
})
export class CalModule {}
