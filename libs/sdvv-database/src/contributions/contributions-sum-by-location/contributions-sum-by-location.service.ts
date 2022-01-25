import { Injectable } from '@nestjs/common';
import { CandidateQLService } from '../../candidate/candidate.service';
import { ZipCodeService } from '../../zip-code/zip-code.service';
import { ContributionsSumByZipCodes } from '../contributions-sum-by-zip-codes/contributions-sum-by-zip-codes.service';

@Injectable()
export class ContributionsSumByLocationService {
  constructor(
    private candidateQLService: CandidateQLService,
    private zipCodeService: ZipCodeService,
    private contributionsSumByZipCodes: ContributionsSumByZipCodes,
  ) {}

  async getDistrictSum({ committeeName }) {
    const district = await this.candidateQLService.getDistrict(committeeName);

    if (!district) {
      return null;
    }

    const zipCodes = await this.zipCodeService.getDistrictZipCodes(district);

    const sum = await this.contributionsSumByZipCodes.getContributionInZipCodes(
      committeeName,
      zipCodes,
    );

    return sum;
  }
  async getCitySum({ committeeName }) {
    const zipCodes = await this.zipCodeService.getCityZipCodes();

    const sum = await this.contributionsSumByZipCodes.getContributionInZipCodes(
      committeeName,
      zipCodes,
    );

    return sum;
  }

  async getCountySum({ committeeName }) {
    const zipCodes = await this.zipCodeService.getCountyZipCodes();

    const sum = await this.contributionsSumByZipCodes.getContributionInZipCodes(
      committeeName,
      zipCodes,
    );

    return sum;
  }

  async getStateSum({ committeeName }) {
    const zipCodes = await this.zipCodeService.getStateZipCodes();

    const sum = await this.contributionsSumByZipCodes.getContributionInZipCodes(
      committeeName,
      zipCodes,
    );

    return sum;
  }

  async getOutOfStateSum({ committeeName }) {
    const zipCodes = await this.zipCodeService.getStateZipCodes();

    const sum =
      await this.contributionsSumByZipCodes.getContributionOutZipCodes(
        committeeName,
        zipCodes,
      );

    return sum;
  }
}
