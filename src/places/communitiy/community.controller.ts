import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Req,
  Res,
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
  async getCommunities(
    @Req() request: Request,
    @Res() res: any,
  ): Promise<Community[]> {
    const token = request.headers.authorization?.split(' ')[1] ?? [];
    try {
      const communities = await this.communityService.getCommunities(token);

      if (!communities) {
        return res.status(404).json({ message: 'Cities not found' });
      }

      return res.json(communities);
    } catch (error) {
      return res.status(error.status).json({ error: error });
    }
  }

  @Get(':id')
  async getCommunityById(
    @Param('id') id: number,
    @Res() res,
  ): Promise<Community> {
    try {
      const community = await this.communityService.getCommunityById(+id);

      if (!community) {
        return res.status(404).json({ message: 'Community not found' });
      }

      return res.json(community);
    } catch (error) {
      return res.status(error.status).json({ error: error });
    }
  }
}
