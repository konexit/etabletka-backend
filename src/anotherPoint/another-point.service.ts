import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AnotherPoint } from './entities/another-point.entity';
import { Repository } from 'typeorm';
import { CreateAnotherPoint } from './dto/create-another-point.dto';
import { UpdateAnotherPoint } from './dto/update-another-point.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AnotherPointService {
  constructor(
    @InjectRepository(AnotherPoint)
    private anotherPointRepository: Repository<AnotherPoint>,
    private jwtService: JwtService,
  ) {}

  async create(token: string, createAnotherPoint: CreateAnotherPoint) {
    if (!token || typeof token !== 'string') {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const payload = await this.jwtService.decode(token);
    if (payload?.roleId !== 1) {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const anotherPoint = this.anotherPointRepository.create(createAnotherPoint);
    if (!anotherPoint) {
      throw new HttpException(
        `Can't create another point with data: ${createAnotherPoint}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.anotherPointRepository.save(anotherPoint);
  }

  async update(
    token: string,
    id: number,
    updateAnotherPoint: UpdateAnotherPoint,
  ) {
    if (!token || typeof token !== 'string') {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const payload = await this.jwtService.decode(token);
    if (payload?.roleId !== 1) {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    await this.anotherPointRepository.update(id, updateAnotherPoint);

    const anotherPoint = await this.anotherPointRepository.findOneBy({
      id,
    });
    if (!anotherPoint) {
      throw new HttpException(
        `Can't update another point with data: ${updateAnotherPoint}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return anotherPoint;
  }

  async delete(token: string, id: number) {
    if (!token || typeof token !== 'string') {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const payload = await this.jwtService.decode(token);
    if (payload?.roleId !== 1) {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const anotherPoint = await this.anotherPointRepository.findOneBy({
      id: id,
    });
    if (!anotherPoint) {
      throw new HttpException(
        'Can`t delete another points',
        HttpStatus.NOT_FOUND,
      );
    }

    if (anotherPoint.cdnData) {
      //TODO: delete all image from CDN before delete record
    }
    return await this.anotherPointRepository.delete(id);
  }

  async getAnotherPoints(): Promise<AnotherPoint[]> {
    const anotherPoints = await this.anotherPointRepository.find({
      order: { id: 'ASC' },
    });

    if (!anotherPoints) return [];

    return anotherPoints;
  }

  async getAnotherPointById(id: number): Promise<AnotherPoint> {
    const anotherPoint = await this.anotherPointRepository.findOneBy({ id });
    if (!anotherPoint) {
      throw new HttpException('Can`t get another point', HttpStatus.NOT_FOUND);
    }
    return anotherPoint;
  }

  async setUseIcon(token: string, id: number): Promise<AnotherPoint> {
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
