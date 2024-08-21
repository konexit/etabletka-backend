import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SellType } from './entities/sell-type.entity';
import { CreateSellTypeDto } from './dto/create-sell-type.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateSellTypeDto } from './dto/update-sell-type.dto';

@Injectable()
export class SellTypeService {
  constructor(
    @InjectRepository(SellType)
    private sellTypeRepository: Repository<SellType>,
    private jwtService: JwtService,
  ) {}

  async create(
    token: string,
    createSellType: CreateSellTypeDto,
  ): Promise<SellType> {
    if (!token || typeof token !== 'string') {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const payload = await this.jwtService.decode(token);
    if (payload.roleId !== 1) {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const sellType = await this.sellTypeRepository.create(createSellType);
    if (!sellType) {
      throw new HttpException(
        `Can't create sell type with this data: ${createSellType}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return sellType;
  }

  async update(
    token: string,
    id: number,
    updateSellType: UpdateSellTypeDto,
  ): Promise<SellType> {
    if (!token || typeof token !== 'string') {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const payload = await this.jwtService.decode(token);
    if (payload.roleId !== 1) {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    await this.sellTypeRepository.update(id, updateSellType);
    const sellType = await this.sellTypeRepository.findOneBy({ id: id });
    if (!sellType) {
      throw new HttpException(
        `Can't update sell type with this data: ${updateSellType}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return sellType;
  }

  async remove(token: string, id: number) {
    if (!token || typeof token !== 'string') {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const payload = await this.jwtService.decode(token);
    if (payload.roleId !== 1) {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    return this.sellTypeRepository.delete(id);
  }

  async getAllSellTypes() {
    const sellTypes = await this.sellTypeRepository.find({});
    if (!sellTypes) {
      throw new HttpException('Sell types not found', HttpStatus.NOT_FOUND);
    }

    return sellTypes;
  }
}
