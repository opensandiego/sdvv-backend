import { CacheModule, Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-ioredis-yet';
import { LastUpdateResolver } from './last-update.resolver';

const url = new URL(process.env.REDIS_URL);
const SIX_HOURS = 21600000; // milliseconds
const TEN_SECONDS = 10000; // milliseconds

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore({
          host: url.hostname,
          port: Number(url.port),
          ttl: process.env.NODE_ENV === 'production' ? SIX_HOURS : TEN_SECONDS,
        }),
      }),
    }),
  ],
  providers: [LastUpdateResolver],
  exports: [],
})
export class LastUpdateModule {}
