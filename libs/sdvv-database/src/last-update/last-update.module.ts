import { CacheModule, Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-yet';

import { LastUpdateResolver } from './last-update.resolver';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore({
          url: process.env.REDIS_URL,
          // 6 hours = 21600000 milliseconds
          // 10 seconds = 10000 milliseconds
          ttl: process.env.NODE_ENV === 'production' ? 21600000 : 10000,
        }),
      }),
    }),
  ],
  providers: [LastUpdateResolver],
  exports: [],
})
export class LastUpdateModule {}
