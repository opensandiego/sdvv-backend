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

@Controller('api')
@UseInterceptors(CacheInterceptor)
export class APIController {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
}
