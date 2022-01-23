import { Module } from '@nestjs/common';
import { CandidateModule } from '../candidate/candidate.module';
import { ZipCodeModule } from '../zip-code/zip-code.module';
import { ContributionService } from './contribution/contribution.service';
import { ContributionsDetailsResolver } from './contributions-details/contributions-details.resolver';
import { ContributionsDetailsService } from './contributions-details/contributions-details.service';
import { ContributionsGroupByResolver } from './contributions-group-by/contributions-group-by.resolver';
import { ContributionsGroupByService } from './contributions-group-by/contributions-group-by.service';
import { ContributionsSumByResolver } from './contributions-sum-by/contributions-sum-by.resolver';
import { ContributionsSumByJurisdictionService } from './contributions-sum-by-jurisdiction/contributions-sum-by-jurisdiction.service';
import { ContributionsSumByLocationResolver } from './contributions-sum-by-location/contributions-sum-by-location.resolver';
import { ContributionsSumByLocationService } from './contributions-sum-by-location/contributions-sum-by-location.service';
import { ContributionsSumByMethodResolver } from './contributions-sum-by-method/contributions-sum-by-method.resolver';
import { ContributionsSumByMethodService } from './contributions-sum-by-method/contributions-sum-by-method.service';
import { ContributionsSumByZipCodes } from './contributions-sum-by-zip-codes/contributions-sum-by-zip-codes.service';

@Module({
  imports: [CandidateModule, ZipCodeModule],
  providers: [
    ContributionService,
    ContributionsDetailsResolver,
    ContributionsDetailsService,
    ContributionsGroupByResolver,
    ContributionsGroupByService,
    ContributionsSumByResolver,
    ContributionsSumByJurisdictionService,
    ContributionsSumByLocationResolver,
    ContributionsSumByLocationService,
    ContributionsSumByMethodResolver,
    ContributionsSumByMethodService,
    ContributionsSumByZipCodes,
  ],
  exports: [],
})
export class ContributionsModule {}
