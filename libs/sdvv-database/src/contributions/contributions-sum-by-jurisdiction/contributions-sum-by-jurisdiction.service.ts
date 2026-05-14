import { Injectable } from '@nestjs/common';
import { CandidateQLService } from '../../candidate/candidate.service';
import { ZipCodeService } from '../../zip-code/zip-code.service';
import { ContributionsSumByZipCodes } from '../contributions-sum-by-zip-codes/contributions-sum-by-zip-codes.service';

@Injectable()
export class ContributionsSumByJurisdictionService {
  constructor(
    private candidateQLService: CandidateQLService,
    private zipCodeService: ZipCodeService,
    private contributionsSumByZipCodes: ContributionsSumByZipCodes,
  ) {}

  async getJurisdictionSums({ committeeName }) {
    // Disable sums by district, due to not having correct zip code to
    // district mapping for districts after 2020.
    // const district = await this.candidateQLService.getDistrict(committeeName);
    const zipCodes = await this.getJurisdictionZipCodes();

    const insideSum =
      await this.contributionsSumByZipCodes.getContributionInZipCodes(
        committeeName,
        zipCodes,
      );

    const outsideSum =
      await this.contributionsSumByZipCodes.getContributionOutZipCodes(
        committeeName,
        zipCodes,
      );

    return { inside: insideSum, outside: outsideSum };
  }

  private async getJurisdictionZipCodes(district?: string) {
    let zipCodes = null;

    if (district) {
      zipCodes = await this.zipCodeService.getDistrictZipCodes(district);
    } else {
      zipCodes = await this.zipCodeService.getCityZipCodes();
    }

    return zipCodes;
  }
}
