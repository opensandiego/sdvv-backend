import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ElectionsController } from './elections/elections.controller';
import { CandidatesController } from './candidates/candidates.controller';
import { ChartDataController } from './chart-data/chart-data.controller';

import { Connection } from 'typeorm';
import { ElectionsModule } from './elections/elections.module';
import { CandidatesModule } from './candidates/candidates.module';
import { FilingsModule } from './filings/filings.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  // imports: [TypeOrmModule.forRoot(), ElectionsModule],
  imports: [
    ElectionsModule,
    CandidatesModule,
    FilingsModule,
    TransactionsModule,
  ],
  controllers: [
    AppController,
    ElectionsController,
    CandidatesController,
    ChartDataController,
  ],
  providers: [AppService],
})
export class AppModule {
  // constructor(private connection: Connection) {}
}
