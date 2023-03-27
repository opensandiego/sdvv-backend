import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { QueueController } from './queue.controller';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('redis.host'),
          port: configService.get('redis.port'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'worker-update-data',
    }),
  ],
  providers: [QueueController],
  exports: [QueueController],
})
export class QueueProducerModule {}
