import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CommitteeService } from './committee.service';

@Resolver('Committee')
export class CommitteeResolver {
  constructor(private committeeService: CommitteeService) {}

  @Query()
  async committee(@Args('committeeName') committeeName: string) {
    return { name: committeeName };
  }

  @ResolveField()
  async id(@Parent() parent) {
    const { name } = parent;
    return await this.committeeService.getMD5(name);
  }

  @ResolveField()
  async dashedName(@Parent() parent) {
    const { name } = parent;
    return name.replaceAll(' ', '-').toLowerCase();
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
