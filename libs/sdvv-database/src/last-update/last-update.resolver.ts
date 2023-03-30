import { Args, Query, Resolver } from '@nestjs/graphql';
import { LastUpdateService } from './last-update.service';
import { LastUpdateYearParams } from './last-update-year.validator';

@Resolver()
export class LastUpdateResolver {
  constructor(private lastUpdateService: LastUpdateService) {}

  @Query()
  async lastUpdate(@Args() args: LastUpdateYearParams) {
    const { year: electionYear } = args;

    const lastUpdateTransaction = await this.lastUpdateService.getLastUpdated(electionYear);

    if (!lastUpdateTransaction) return { dateTime: 'Date NOT found' };

    if (new Date(lastUpdateTransaction).toString() === 'Invalid Date') return { dateTime: 'Date NOT Valid' };

    const lastUpdateDateTime = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'short',
    })?.format(new Date(lastUpdateTransaction));

    return {
      dateTime: lastUpdateDateTime ? lastUpdateDateTime : 'NOT Available',
    };
  }
}
