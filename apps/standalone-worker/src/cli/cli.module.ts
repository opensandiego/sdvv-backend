import { Module } from '@nestjs/common';
import { ConsoleModule } from 'nestjs-console';
import { QueueProducerModule } from '../queue-producer/queue-producer.module';
import { CLIService } from './cli.service';

@Module({
  imports: [ConsoleModule, QueueProducerModule],
  providers: [CLIService],
  exports: [CLIService],
})
export class CLIModule {}
