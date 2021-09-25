import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { CalController } from './cal.controller';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'cal-tasks',
    }),
  ],
  controllers: [CalController],
})
export class CalModule {}
