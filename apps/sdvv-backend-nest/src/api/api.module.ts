import { CacheModule, Module } from '@nestjs/common';
import type { ClientOpts as RedisClientOpts } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { QueriesModule } from '@app/efile-api-data/queries/queries.module';
import { APIController } from './api.controller';
import { APIService } from './api.service';
import { APICandidateCardService } from './api.candidate.card.service';
import { APICandidateQuickViewService } from './api.candidate.quickview.service';
import { APICandidateDetailsService } from './api.candidate.details.service';
import { APILastUpdatedService } from './api-last-updated.service';
import { APINonCachedController } from './api-non-cached.controller';

@Module({
  imports: [
    CacheModule.register<RedisClientOpts>({
      store: redisStore,
      url: process.env.REDIS_URL,
      // In production set cache to 6 hours = 21600 seconds
      ttl: process.env.NODE_ENV === 'production' ? 21600 : 10,
    }),
    QueriesModule,
  ],
  providers: [
    APIService,
    APICandidateCardService,
    APICandidateQuickViewService,
    APICandidateDetailsService,
    APILastUpdatedService,
  ],
  controllers: [APIController, APINonCachedController],
})
export class APIModule {}
