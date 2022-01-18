import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { ExpendituresModule } from './expenditures/expenditures.module';
import { ContributionsSummaryModule } from './contributions-summary/contributions-summary.module';

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
    ExpendituresModule,
    ContributionsSummaryModule,
  ],
})
export class GraphQLSetupModule {}
