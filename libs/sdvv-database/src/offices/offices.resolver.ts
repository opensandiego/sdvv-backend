import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { OfficesService } from './offices.service';

@Resolver('OfficesByType')
export class OfficesResolver {
  constructor(private officesService: OfficesService) {}

  @ResolveField()
  async mayor(@Parent() parent) {
    const { year: electionYear } = parent;
    const type = 'MAYOR';
    const title = 'Mayor';

    const committeeNames = await this.officesService.getCommitteeNames({
      electionYear,
      officeName: title,
    });

    if (committeeNames.length > 0) {
      return { type, title, committeeNames, electionYear };
    }
  }

  @ResolveField()
  async cityCouncil(@Parent() parent) {
    const { year: electionYear } = parent;
    const type = 'CITY_COUNCIL';
    const title = 'City Council';

    const committeeNames = await this.officesService.getCommitteeNames({
      electionYear,
      officeName: title,
    });

    if (committeeNames.length > 0) {
      return { type, title, committeeNames, electionYear };
    }
  }

  @ResolveField()
  async cityAttorney(@Parent() parent) {
    const { year: electionYear } = parent;
    const type = 'CITY_ATTORNEY';
    const title = 'City Attorney';

    const committeeNames = await this.officesService.getCommitteeNames({
      electionYear,
      officeName: title,
    });

    if (committeeNames.length > 0) {
      return { type, title, committeeNames, electionYear };
    }
  }
}
