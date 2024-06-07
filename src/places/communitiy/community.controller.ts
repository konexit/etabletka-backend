import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { CommunityService } from './community.service';
import { Request } from 'express';
import { Community } from './entities/community.entity';

@Controller('api/v1/communities')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async getCommunities(@Req() request: Request): Promise<Community[]> {
    const token = request.headers.authorization?.split(' ')[1] ?? [];

    return await this.communityService.getCommunities(token);
  }

  @Get(':id')
  async getCommunityById(@Param('id') id: number): Promise<Community> {
    return await this.communityService.getCommunityById(+id);
  }
}
