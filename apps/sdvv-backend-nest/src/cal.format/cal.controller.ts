import { Body, Controller, Param, Post } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Controller('cal')
export class CalController {
  constructor(@InjectQueue('cal-tasks') private readonly tasksQueue: Queue) {}

  @Post('update/:year')
  async updateYear(@Param('year') year: number) {
    console.log(`update/:year/${year}`);
    await this.tasksQueue.add({
      update: 'xlsx',
      year: year,
    });
  }
}
