import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class APILastUpdatedService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getLastUpdated() {
    const lastUpdated = await this.cacheManager.get('last-updated-date-time');
    return { updated: lastUpdated };
  }
}
