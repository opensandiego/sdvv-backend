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
}
