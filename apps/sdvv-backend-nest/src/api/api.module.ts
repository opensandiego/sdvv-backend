import { CacheModule, Module } from '@nestjs/common';
import { QueriesModule } from '@app/efile-api-data/queries/queries.module';
import { APIController } from './api.controller';
import { APIService } from './api.service';
import { APICandidateCardService } from './api.candidate.card.service';
import { APICandidateQuickViewService } from './api.candidate.quickview.service';
import { APICandidateDetailsService } from './api.candidate.details.service';

@Module({
  imports: [
    CacheModule.register({
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
  ],
  controllers: [APIController],
})
export class APIModule {}
