import { Query, Resolver } from '@nestjs/graphql';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Resolver()
export class LastUpdateResolver {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  @Query()
  async lastUpdate() {
    // const lastUpdateDateTime = await this.cacheManager?.get<string>(
    //   'last-updated-date-time',
    // );
    const lastUpdateDateTime = null;
    // console.log({ lastUpdateDateTime2 });
    // const lastUpdateDateTime = 'ABC_123';
    return {
      dateTime: lastUpdateDateTime ? lastUpdateDateTime : 'NOT Available',
    };
  }
}
