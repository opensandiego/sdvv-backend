import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ElectionYearsModule } from './election-years/election-years.module';
import { OfficesModule } from './offices/offices.module';
import { CandidateModule } from './candidate/candidate.module';
import { CommitteeModule } from './committee/committee.module';
import { ContributionsModule } from './contributions/contributions.module';
import { ExpensesModule } from './expenses/expenses.module';
import { IndependentExpendituresModule } from './independent-expenditures/independent-expenditures.module';
import { LastUpdateModule } from './last-update/last-update.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
      },
      cache: 'bounded',
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    ElectionYearsModule,
    OfficesModule,
    CandidateModule,
    CommitteeModule,
    ContributionsModule,
    ExpensesModule,
    IndependentExpendituresModule,
    LastUpdateModule,
  ],
})
export class GraphQLSetupModule {}
