import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Badge } from './entities/badge.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

@Injectable()
export class BadgeService {
  constructor(
    @InjectRepository(Badge)
    private badgeRepository: Repository<Badge>,
    private jwtService: JwtService,
  ) {}

  async getBadges(): Promise<Badge[]> {
    const badges = await this.badgeRepository.find({});

    if (!badges) {
      throw new HttpException('Badges not found', HttpStatus.NOT_FOUND);
    }

    return badges;
  }
}
