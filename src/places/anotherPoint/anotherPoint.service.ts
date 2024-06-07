import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AnotherPoint } from './entities/anotherPoint.entity';
import { Repository } from 'typeorm';

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
}
