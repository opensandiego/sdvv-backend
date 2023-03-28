import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LastUpdateResolver } from './last-update.resolver';

const SIX_HOURS = 21600000; // milliseconds
const TEN_SECONDS = 10000; // milliseconds

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        url: process.env.REDIS_URL,
        ttl: process.env.NODE_ENV === 'production' ? SIX_HOURS : TEN_SECONDS,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [LastUpdateResolver],
  exports: [],
})
export class LastUpdateModule {}
