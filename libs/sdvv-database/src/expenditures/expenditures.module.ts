import { Module } from '@nestjs/common';
import { ExpendituresResolver } from './expenditures.resolver';
import { ExpendituresService } from './expenditures.service';

@Module({
  imports: [],
  providers: [ExpendituresService, ExpendituresResolver],
  exports: [ExpendituresService],
})
export class ExpendituresModule {}
