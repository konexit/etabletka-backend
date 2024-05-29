import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { District } from './entities/district.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class DistrictService {
  constructor(
    @InjectRepository(District)
    private districtRepository: Repository<District>,
    private jwtService: JwtService,
  ) {}

  async getAllDistricts(token: string | any[]): Promise<any> {
    if (!token || typeof token !== 'string') {
      throw new HttpException('No access', HttpStatus.FORBIDDEN);
    }
    const districts = await this.districtRepository.find();
    if (districts) return districts;

    throw new HttpException('Districts not found', HttpStatus.NOT_FOUND);
  }
}
