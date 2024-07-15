import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreBrand } from './entities/store-brand.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateStoreBrand } from './dto/create-store-brand.dto';
import { UpdateStoreBrand } from './dto/update-store-brand.dto';

@Injectable()
export class StoreBrandService {
  constructor(
    @InjectRepository(StoreBrand)
    private readonly storeBrandRepository: Repository<StoreBrand>,
    private jwtService: JwtService,
  ) {}

  async create(token: string | any[], createStoreBrand: CreateStoreBrand) {
    if (!token || typeof token !== 'string') {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const payload = await this.jwtService.decode(token);
    if (payload.roleId !== 1) {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const storeBrand = this.storeBrandRepository.create(createStoreBrand);
    if (!storeBrand) {
      throw new HttpException(
        `Can't create store brand with this data: ${createStoreBrand}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.storeBrandRepository.save(storeBrand);
  }

  async update(
    token: string | any[],
    id: number,
    updateStoreBrand: UpdateStoreBrand,
  ) {
    if (!token || typeof token !== 'string') {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const payload = await this.jwtService.decode(token);
    if (payload.roleId !== 1) {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    await this.storeBrandRepository.update(id, updateStoreBrand);
    const storeBrand = await this.storeBrandRepository.findOneBy({ id: id });
    if (!storeBrand) {
      throw new HttpException(
        `Can't update store brand with this data: ${updateStoreBrand}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return storeBrand;
  }

  async getAllStoreBrands(): Promise<StoreBrand[]> {
    const storeBrands = await this.storeBrandRepository.find({});
    if (!storeBrands) {
      throw new HttpException('Store brands not found', HttpStatus.NOT_FOUND);
    }
    return storeBrands;
  }

  async getStoreBrandById(id: number): Promise<StoreBrand> {
    const storeBrand = await this.storeBrandRepository.findOneBy({ id });
    if (!storeBrand) {
      throw new HttpException('Store brand not found', HttpStatus.NOT_FOUND);
    }
    return storeBrand;
  }
}
