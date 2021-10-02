import { CacheModule, Module } from '@nestjs/common';
import { APIController } from './api.controller';
import { APIService } from './api.service';

@Module({
  imports: [
    CacheModule.register({
      ttl: 30, // seconds
      // ttl: 0, // disable expiration
    }),
  ],
  providers: [APIService],
  controllers: [APIController],
})
export class APIModule {}
