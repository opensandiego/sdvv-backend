import { CacheModule, Module } from '@nestjs/common';
import { QueriesModule } from '@app/efile-api-data/queries/queries.module';
import { APIController } from './api.controller';
import { APIService } from './api.service';

@Module({
  imports: [
    CacheModule.register({
      ttl: 30, // seconds
      // ttl: 0, // disable expiration
    }),
    QueriesModule,
  ],
  providers: [APIService],
  controllers: [APIController],
})
export class APIModule {}
