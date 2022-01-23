import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { CandidateModule } from './candidate/candidate.module';
import { CommitteeModule } from './committee/committee.module';
import { ExpendituresModule } from './expenditures/expenditures.module';
import { ContributionsModule } from './contributions/contributions.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
      },
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    CandidateModule,
    CommitteeModule,
    ContributionsModule,
    ExpendituresModule,
  ],
})
export class GraphQLSetupModule {}
