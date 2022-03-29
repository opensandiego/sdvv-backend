import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { OfficesService } from './offices.service';

@Resolver('OfficesByType')
export class OfficesResolver {
  constructor(private officesService: OfficesService) {}

  @ResolveField()
  async mayor(@Parent() parent) {
    const { year: electionYear, filters: parentFilters } = parent;
    const title = 'Mayor';

    const filters = {
      ...parentFilters,
      offices: [title],
    };

    return { title, electionYear, filters };
  }

  @ResolveField()
  async cityCouncil(@Parent() parent) {
    const { year: electionYear, filters: parentFilters } = parent;
    const title = 'City Council';

    const filters = {
      ...parentFilters,
      offices: [title],
    };

    return { title, electionYear, filters };
  }

  @ResolveField()
  async cityAttorney(@Parent() parent) {
    const { year: electionYear, filters: parentFilters } = parent;
    const title = 'City Attorney';

    const filters = {
      ...parentFilters,
      offices: [title],
    };

    return { title, electionYear, filters };
  }
}
