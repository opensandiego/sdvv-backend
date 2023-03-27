import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-ioredis-yet';
import { LastUpdateResolver } from './last-update.resolver';

const SIX_HOURS = 21600000; // milliseconds
const TEN_SECONDS = 10000; // milliseconds

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          host: configService.get('redis.host'),
          port: configService.get('redis.port'),
          ttl: process.env.NODE_ENV === 'production' ? SIX_HOURS : TEN_SECONDS,
        }),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [LastUpdateResolver],
  exports: [],
})
export class LastUpdateModule {}
