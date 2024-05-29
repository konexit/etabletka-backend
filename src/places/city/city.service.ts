import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from './entities/city.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City)
    private cityRepository: Repository<City>,
    private jwtService: JwtService,
  ) {}

  async getCities(token: string | any[]): Promise<City[]> {
    if (!token || typeof token !== 'string') {
      throw new HttpException('Cities not found', HttpStatus.FORBIDDEN);
    }
    const cities = await this.cityRepository.find();
    if (cities) return cities;

    throw new HttpException('Cities not found', HttpStatus.NOT_FOUND);
  }

  async getCityById(id: number): Promise<City | undefined> {
    return await this.cityRepository.findOneBy({ id });
  }
}
