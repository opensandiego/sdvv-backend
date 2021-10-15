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
      ttl: 30, // seconds
      // ttl: 0, // disable expiration
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
