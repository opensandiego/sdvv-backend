import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

@Resolver('IndependentExpenditures')
export class IndependentExpendituresResolver {
  @ResolveField()
  async candidateName(@Parent() candidate) {
    const { lastName } = candidate;
    return lastName;
  }

  @ResolveField()
  async electionYear(@Parent() candidate) {
    const { electionYear } = candidate;
    return electionYear;
  }

  @ResolveField()
  async sums(@Parent() candidate) {
    return candidate;
  }

  @ResolveField()
  async committees(@Parent() candidate) {
    return candidate;
  }
}
