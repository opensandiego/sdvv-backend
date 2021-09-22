import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { join } from 'path';
import { HttpModule } from '@nestjs/axios';
import { CalService } from './cal.service';
import { CalController } from './cal.controller';
import { F460DEntity } from './entity/f460d.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([F460DEntity]),
    BullModule.registerQueue({
      name: 'cal-tasks',
      processors: [join(__dirname, 'cal.processor.js')],
    }),
    HttpModule,
  ],
  providers: [CalService],
  controllers: [CalController],
})
export class CalModule {}
