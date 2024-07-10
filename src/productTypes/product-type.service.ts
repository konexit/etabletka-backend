import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { ProductType } from './entities/product-type.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ProductTypeService {
  constructor(
    @InjectRepository(ProductType)
    private productTypeRepository: Repository<ProductType>,
    private jwtService: JwtService,
  ) {}

  async findAll(): Promise<ProductType[]> {
    const productTypes = await this.productTypeRepository.find();

    if (!productTypes) {
      throw new HttpException('Product types not found', HttpStatus.NOT_FOUND);
    }

    return productTypes;
  }

  async findOne(id: number): Promise<ProductType> {
    const productType = await this.productTypeRepository.findOneBy({ id: id });
    if (!productType) {
      throw new HttpException('Product type not found', HttpStatus.NOT_FOUND);
    }

    return productType;
  }

  remove(id: number) {
    return `This action removes the #${id} product type`;
  }
}
