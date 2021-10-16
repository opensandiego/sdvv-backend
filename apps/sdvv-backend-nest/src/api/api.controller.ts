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
import { APICandidateCardService } from './api.candidate.card.service';
import { APICandidateQuickViewService } from './api.candidate.quickview.service';
import { APICandidateDetailsService } from './api.candidate.details.service';
import { OfficeSummary } from './interfaces/office.summary';
import { CandidateCard } from './interfaces/candidate.card';
import { CandidateQuickView } from './interfaces/candidate.quickview';
import { CandidateDetailsHeader } from './interfaces/candidate.details.header';
import { CandidateDetailsRaisedSpent } from './interfaces/candidate.details.raised.spent';
import { CandidateDetailsRaisedByGroup } from './interfaces/candidate.details.raised.group';
import { CandidateDetailsRaisedByLocation } from './interfaces/candidate.details.raised.location';
import { CandidateDetailsOutsideMoney } from './interfaces/candidate.details.outside.money';
import { CandidateNavigation } from './interfaces/candidate.navigation';

@Controller('api')
@UseInterceptors(CacheInterceptor)
export class APIController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private apiService: APIService,
    private apiCandidateCardService: APICandidateCardService,
    private apiCandidateQuickViewService: APICandidateQuickViewService,
    private apiCandidateDetailsService: APICandidateDetailsService,
  ) {}

  // @Get('elections')

  @Get('candidates/navigation/:election_id')
  async getCandidateNavigation(
    @Param('election_id') electionId: string,
  ): Promise<CandidateNavigation[]> {
    return await this.apiService.getCandidateNavigation(electionId);
  }

  @Get('summary/:election_id')
  async getSummary(
    @Param('election_id') electionId: string,
  ): Promise<OfficeSummary[]> {
    return await this.apiService.getOfficesSummary(electionId);
  }

  @Get('candidate/card/:candidate_id')
  async getCandidateCard(
    @Param('candidate_id') candidateId: string,
  ): Promise<CandidateCard> {
    return await this.apiCandidateCardService.getCandidateCard(candidateId);
  }

  @Get('candidate/quick-view/:candidate_id')
  async getCandidateCardExpanded(
    @Param('candidate_id') candidateId: string,
  ): Promise<CandidateQuickView> {
    return await this.apiCandidateQuickViewService.getCandidateCardExpanded(
      candidateId,
    );
  }

  @Get('candidate/details/header/:candidate_id')
  async getCandidateDetailsHeader(
    @Param('candidate_id') candidateId: string,
  ): Promise<CandidateDetailsHeader> {
    return await this.apiCandidateDetailsService.getCandidateDetailsHeader(
      candidateId,
    );
  }

  @Get('candidate/details/raised-spent/:candidate_id')
  async getCandidateDetailsRaisedSpent(
    @Param('candidate_id') candidateId: string,
  ): Promise<CandidateDetailsRaisedSpent> {
    return await this.apiCandidateDetailsService.getCandidateDetailsRaisedSpent(
      candidateId,
    );
  }

  @Get('candidate/details/raised-by-industry/:candidate_id')
  async getCandidateDetailsRaisedByIndustry(
    @Param('candidate_id') candidateId: string,
  ): Promise<CandidateDetailsRaisedByGroup> {
    return await this.apiCandidateDetailsService.getCandidateDetailsRaisedByIndustry(
      candidateId,
    );
  }

  @Get('candidate/details/raised-by-location/:candidate_id')
  async getCandidateDetailsRaisedByLocation(
    @Param('candidate_id') candidateId: string,
  ): Promise<CandidateDetailsRaisedByLocation> {
    return await this.apiCandidateDetailsService.getCandidateDetailsRaisedByLocation(
      candidateId,
    );
  }

  @Get('candidate/details/raised-outside-money/:candidate_id')
  async getCandidateDetailsOutsideMoney(
    @Param('candidate_id') candidateId: string,
  ): Promise<CandidateDetailsOutsideMoney> {
    return await this.apiCandidateDetailsService.getCandidateDetailsOutsideMoney(
      candidateId,
    );
  }
}
