import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SkillService } from './skill.service';
import { Logger, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/guards/gql-auth/gql-auth.guard';
import { Skill } from '@server/entities';
import { DecodedUserObjectType } from '../../auth/dto';
import { CurrentUser } from '../../common/decorators';
import { GetSkillEntriesArgsType, UpdateSkillEntryArgsType } from './dto';

@UseGuards(GqlAuthGuard)
@Resolver()
export class SkillResolver {
  private readonly logger = new Logger(SkillResolver.name);
  constructor(private readonly skillService: SkillService) {}

  @Query(() => [Skill])
  async getSkillEntries(
    @CurrentUser() { client_id }: DecodedUserObjectType,
    @Args() { cvId }: GetSkillEntriesArgsType
  ): Promise<Skill[]> {
    return this.skillService.findAll(
      {
        searchParams: { cvId },
      },
      client_id
    );
  }

  @Mutation(() => Boolean)
  async updateSkill(
    @CurrentUser() { client_id }: DecodedUserObjectType,
    @Args() data: UpdateSkillEntryArgsType
  ): Promise<boolean> {
    await this.skillService.update({ data }, client_id);
    return true;
  }
}
