import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { ZipCodesModule } from './zipCodes/zipCodes.module';
import { JurisdictionsModule } from './jurisdictions/jurisdictions.module';
import { GraphQLSetupModule } from './graphql-setup.module';

@Module({
  imports: [ZipCodesModule, JurisdictionsModule, GraphQLSetupModule],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
