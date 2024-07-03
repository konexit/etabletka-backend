import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Region } from './entities/region.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RegionService {
  constructor(
    @InjectRepository(Region)
    private regionRepository: Repository<Region>,
    private jwtService: JwtService,
  ) {}

  async getRegions(token: string | any[], lang: string = 'uk'): Promise<any> {
    // if (!token || typeof token !== 'string') {
    //   throw new HttpException('No access', HttpStatus.FORBIDDEN);
    // }
    const regions: Region[] = await this.regionRepository.find({});
    if (!regions) {
      throw new HttpException('Regions not found', HttpStatus.NOT_FOUND);
    }
    for (const region of regions) {
      region.name = region.name[lang];
    }
    return regions;
  }
}
