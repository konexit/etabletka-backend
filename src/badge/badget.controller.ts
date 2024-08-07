import { Controller, Req } from '@nestjs/common';
import { Badge } from './entities/badge.entity';
import { Request } from 'express';
import { BadgeService } from './badge.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('badge')
@Controller('api/v1/badge')
export class BadgeController {
  constructor(private readonly badgeService: BadgeService) {}

  async getBadges(@Req() request: Request): Promise<Badge[]> {
    return await this.badgeService.getBadges();
  }
}
