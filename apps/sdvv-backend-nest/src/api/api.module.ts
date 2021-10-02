import { CacheModule, Module } from '@nestjs/common';
import { APIController } from './api.controller';

@Module({
  imports: [
    CacheModule.register({
      ttl: 30, // seconds
      // ttl: 0, // disable expiration
    }),
  ],
  providers: [],
  controllers: [APIController],
})
export class APIModule {}
