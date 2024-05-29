import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductType } from './entities/productType.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ProductTypeService {
  constructor(
    @InjectRepository(ProductType)
    private productTypeRepository: Repository<ProductType>,
    private jwtService: JwtService,
  ) {}

  async findAll() {
    return await this.productTypeRepository.find();
  }

  async findOne(id: number): Promise<ProductType> {
    return await this.productTypeRepository.findOneBy({ id: id });
  }

  remove(id: number) {
    return `This action removes the #${id} product type`;
  }
}
