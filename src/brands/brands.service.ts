import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {}

  create(createBrandDto: CreateBrandDto) {
    return 'This action adds a new brand';
  }

  async findAll(lang: string = 'uk'): Promise<Brand[]> {
    const brands = await this.brandRepository.find({});
    if (!brands) {
      throw new HttpException('Brands not found', HttpStatus.NOT_FOUND);
    }

    for (const brand of brands) {
      brand.name = brand?.name[lang];
    }

    return brands;
  }

  async findOne(id: number): Promise<Brand> {
    return await this.brandRepository.findOneBy({ id, active: true });
  }

  update(id: number, updateBrandDto: UpdateBrandDto) {
    return `This action updates a #${id} brand`;
  }

  remove(id: number) {
    return `This action removes a #${id} brand`;
  }
}
