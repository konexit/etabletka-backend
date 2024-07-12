import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AnotherPoint } from './entities/anotherPoint.entity';
import { Repository } from 'typeorm';
import { Store } from '../../store/entities/store.entity';

@Injectable()
export class AnotherPointService {
  constructor(
    @InjectRepository(AnotherPoint)
    private anotherPointRepository: Repository<AnotherPoint>,
  ) {}

  async getAnotherPoints(): Promise<AnotherPoint[]> {
    const anotherPoints = await this.anotherPointRepository.find({});
    if (!anotherPoints) {
      throw new HttpException('Can`t get another points', HttpStatus.NOT_FOUND);
    }
    return anotherPoints;
  }

  async getAnotherPointById(id: number): Promise<AnotherPoint> {
    const anotherPoint = await this.anotherPointRepository.findOneBy({ id });
    if (!anotherPoint) {
      throw new HttpException('Can`t get another point', HttpStatus.NOT_FOUND);
    }
    return anotherPoint;
  }

  async setUseIcon(token: string | any[], id: number): Promise<AnotherPoint> {
    if (!token || typeof token !== 'string') {
      throw new HttpException('No access', HttpStatus.FORBIDDEN);
    }

    const anotherPoint = await this.anotherPointRepository.findOneBy({ id });
    if (!anotherPoint) {
      throw new HttpException('Stores not found', HttpStatus.NOT_FOUND);
    }

    anotherPoint.isActive = !anotherPoint.isActive;

    return this.anotherPointRepository.save(anotherPoint);
  }
}
