import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { OfficesService } from './offices.service';

@Resolver('OfficesByType')
export class OfficesResolver {
  constructor(private officesService: OfficesService) {}

  @ResolveField()
  async mayor(@Parent() parent) {
    const { year: electionYear } = parent;
    const title = 'Mayor';

    return { title, electionYear };
  }

  @ResolveField()
  async cityCouncil(@Parent() parent) {
    const { year: electionYear } = parent;
    const title = 'City Council';

    return { title, electionYear };
  }

  @ResolveField()
  async cityAttorney(@Parent() parent) {
    const { year: electionYear } = parent;
    const title = 'City Attorney';

    return { title, electionYear };
  }
}
