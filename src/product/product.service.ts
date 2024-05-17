import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Product from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private jwtService: JwtService,
  ) {}

  async getProductBySyncId(syncId: number): Promise<Product> {
    if (!syncId)
      throw new HttpException(
        'The syncId is not define',
        HttpStatus.BAD_REQUEST,
      );

    const product = await this.productRepository.findOneBy({ syncId: syncId });
    if (product) return product;

    throw new HttpException(
      'Product with this syncId does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    await this.productRepository.save(product);
    console.log('PRODUCT', product);
    return product;
  }

  async findAll(token: string | any[]) {
    if (!token || typeof token !== 'string') {
      return await this.productRepository.find({
        where: { isActive: true },
      });
    }
    const payload = await this.jwtService.decode(token);
    if (payload.userType === 1) {
      return await this.productRepository.find({
        where: { isActive: true },
      });
    }
    return await this.productRepository.find({});
  }

  async findOne(id: number): Promise<Product> {
    return await this.productRepository.findOne({
      where: { id, isActive: true },
      relations: ['productRemnants'], // Explicitly include the relationship
    });
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    await this.productRepository.update(id, updateProductDto);
    const product = await this.productRepository.findOneBy({ id: id });
    if (product) {
      return product;
    }
    throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
  }

  remove(id: number) {
    return `This action removes the #${id} product`;
  }
}
