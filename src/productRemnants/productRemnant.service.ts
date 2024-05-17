import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import ProductRemnant from './entities/productRemnant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateProductRemnantDto from './dto/create-product-remnant.dto';
import { UpdateProductRemnantDto } from './dto/update-product-remnant.dto';

@Injectable()
export class ProductRemnantService {
  constructor(
    @InjectRepository(ProductRemnant)
    private productRemnantsRepository: Repository<ProductRemnant>,
  ) {}

  async getProductRemnantsByProductId(productId: number) {
    if (!productId)
      throw new HttpException(
        'The productId is not define',
        HttpStatus.BAD_REQUEST,
      );

    const productRemnants = await this.productRemnantsRepository.findBy({
      productId: productId,
    });
    if (productRemnants) return productRemnants;

    throw new HttpException(
      'Product with this syncId does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async create(
    createProductRemnantsDto: CreateProductRemnantDto,
  ): Promise<ProductRemnant> {
    const productRemnant = this.productRemnantsRepository.create(
      createProductRemnantsDto,
    );
    await this.productRemnantsRepository.save(productRemnant);
    console.log('ProductRemnant', productRemnant);
    return productRemnant;
  }

  async findAll() {
    return await this.productRemnantsRepository.find();
  }

  async findOne(id: number): Promise<ProductRemnant> {
    return await this.productRemnantsRepository.findOneBy({ id: id });
  }

  async update(
    id: number,
    updateProductRemnantDto: UpdateProductRemnantDto,
  ): Promise<ProductRemnant> {
    await this.productRemnantsRepository.update(id, updateProductRemnantDto);
    const productRemnant = await this.productRemnantsRepository.findOneBy({
      id: id,
    });
    if (productRemnant) {
      return productRemnant;
    }
    throw new HttpException('Product remnant not found', HttpStatus.NOT_FOUND);
  }

  remove(id: number) {
    return `This action removes the #${id} product remnant`;
  }
}
