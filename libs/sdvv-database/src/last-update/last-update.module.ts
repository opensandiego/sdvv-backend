import { CacheModule, Module } from '@nestjs/common';
// import type { ClientOpts as RedisClientOpts } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { LastUpdateResolver } from './last-update.resolver';

@Module({
  imports: [
    // CacheModule.register<RedisClientOpts>({
    CacheModule.register({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      store: redisStore,
      url: process.env.REDIS_URL,
      // In production set cache to 6 hours = 21600 seconds
      // ttl: process.env.NODE_ENV === 'production' ? 21600 : 10,
    }),
  ],
  providers: [LastUpdateResolver],
  exports: [],
})
export class LastUpdateModule {}
