import { Controller, Req, Res } from '@nestjs/common';
import { Badge } from './entities/badge.entity';
import { Request } from 'express';
import { BadgeService } from './badge.service';

@Controller('api/v1/badge')
export class BadgeController {
  constructor(private readonly badgeService: BadgeService) {}

  async getBadges(@Req() request: Request, @Res() res): Promise<Badge[]> {
    try {
      const pages = await this.badgeService.getBadges();

      if (!pages) {
        return res.status(404).json({ message: 'Pages not found' });
      }

      return res.json(pages);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
