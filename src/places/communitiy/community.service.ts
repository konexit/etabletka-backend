import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Community } from './entities/community.entity';

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(Community)
    private communityRepository: Repository<Community>,
    private jwtService: JwtService,
  ) {}

  async getCommunities(token: string | any[]): Promise<Community[]> {
    if (!token || typeof token !== 'string') {
      throw new HttpException('Cities not found', HttpStatus.FORBIDDEN);
    }
    const cities = await this.communityRepository.find();
    if (cities) return cities;

    throw new HttpException('Cities not found', HttpStatus.NOT_FOUND);
  }

  async getCommunityById(id: number): Promise<Community | undefined> {
    return await this.communityRepository.findOneBy({ id });
  }
}
