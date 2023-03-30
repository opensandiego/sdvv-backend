import { Module } from '@nestjs/common';
import { LastUpdateResolver } from './last-update.resolver';
import { LastUpdateService } from './last-update.service';

@Module({
  imports: [],
  providers: [LastUpdateResolver, LastUpdateService],
  exports: [],
})
export class LastUpdateModule {}
