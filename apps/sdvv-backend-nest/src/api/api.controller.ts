import {
  CacheInterceptor,
  CACHE_MANAGER,
  Controller,
  Get,
  Inject,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { APIService } from './api.service';

@Controller('api')
@UseInterceptors(CacheInterceptor)
export class APIController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private apiService: APIService,
  ) {}

  @Get('summary/:election_id')
  async getSummary(@Param('election_id') electionId: string) {
    return await this.apiService.getOfficesSummary(electionId);
  }

  @Get('candidate/card/:candidate_id')
  async getCandidateCard(@Param('candidate_id') candidateId: string) {
    return await this.apiService.getCandidateCard(candidateId);
  }

  @Get('candidate/card/expanded/:candidate_id')
  async getCandidateCardExpanded(@Param('candidate_id') candidateId: string) {
    return await this.apiService.getCandidateCardExpanded(candidateId);
  }

  @Get('candidate/details/header/:candidate_id')
  async getCandidateDetailsHeader(@Param('candidate_id') candidateId: string) {
    return await this.apiService.getCandidateDetailsHeader(candidateId);
  }

  @Get('candidate/details/raised-spent/:candidate_id')
  async getCandidateDetailsRaisedSpent(
    @Param('candidate_id') candidateId: string,
  ) {
    return await this.apiService.getCandidateDetailsRaisedSpent(candidateId);
  }

  @Get('candidate/details/raised-by-industry/:candidate_id')
  async getCandidateDetailsRaisedByIndustry(
    @Param('candidate_id') candidateId: string,
  ) {
    return await this.apiService.getCandidateDetailsRaisedByIndustry(
      candidateId,
    );
  }

  @Get('candidate/details/raised-by-location/:candidate_id')
  async getCandidateDetailsRaisedByLocation(
    @Param('candidate_id') candidateId: string,
  ) {
    return await this.apiService.getCandidateDetailsRaisedByLocation(
      candidateId,
    );
  }

  @Get('candidate/details/raised-outside-money/:candidate_id')
  async getCandidateDetailsOutsideMoney(
    @Param('candidate_id') candidateId: string,
  ) {
    return await this.apiService.getCandidateDetailsOutsideMoney(candidateId);
  }
}
