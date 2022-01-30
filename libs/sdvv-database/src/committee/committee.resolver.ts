import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

@Resolver('Committee')
export class CommitteeResolver {
  @Query()
  async committee(@Args('committeeName') committeeName: string) {
    return { id: committeeName, name: committeeName };
  }

  @ResolveField()
  async contributions(@Parent() parent) {
    const { name } = parent;
    return { committeeName: name };
  }

  @ResolveField()
  async expenses(@Parent() parent) {
    const { name } = parent;
    return { committeeName: name };
  }
}
