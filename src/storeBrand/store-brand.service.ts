import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreBrand } from './entities/store-brand.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StoreBrandService {
  constructor(
    @InjectRepository(StoreBrand)
    private readonly storeBrandRepository: Repository<StoreBrand>,
  ) {}

  async getAllStoreBrands(): Promise<StoreBrand[]> {
    const storeBrands = await this.storeBrandRepository.find({});
    if (!storeBrands) {
      throw new HttpException(
        'Store brands categories not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return storeBrands;
  }
}
