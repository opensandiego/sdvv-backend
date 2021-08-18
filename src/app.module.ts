import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ElectionsController } from './elections/elections.controller';
import { CandidatesController } from './candidates/candidates.controller';
import { ChartDataController } from './chart-data/chart-data.controller';

@Module({
  imports: [],
  controllers: [
    AppController,
    ElectionsController,
    CandidatesController,
    ChartDataController,
  ],
  providers: [AppService],
})
export class AppModule {}
