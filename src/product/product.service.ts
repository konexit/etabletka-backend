import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Badge } from '../badge/entities/badge.entity';
import { Discount } from '../discount/entities/discount.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Discount)
    private discountRepository: Repository<Discount>,
    @InjectRepository(Badge)
    private readonly badgeRepository: Repository<Badge>,
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

  async getProductsByCategoryId(categoryId): Promise<Product[]> {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'category')
      .leftJoinAndSelect('product.discounts', 'discount')
      .leftJoinAndSelect('product.badges', 'badges')
      .where('category.id = :categoryId', { categoryId })
      .getMany();

    if (!products) {
      throw new HttpException('Category not found', HttpStatus.BAD_REQUEST);
    }

    return products;
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
    if (payload.roleId === 1) {
      return await this.productRepository.find({
        where: { isActive: true },
      });
    }
    return await this.productRepository.find({});
  }

  async findAllSales() {
    //TODO: add cache for this !!!
    const queryBuilder = this.productRepository.createQueryBuilder('product');

    queryBuilder.leftJoinAndSelect('product.discounts', 'discount');
    queryBuilder.leftJoinAndSelect(
      'product.productRemnants',
      'productRemnants',
    );
    queryBuilder.where('discount.id IS NOT NULL');

    return await queryBuilder.getMany();
  }

  async findProductById(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id, isActive: true },
      relations: ['productRemnants'],
    });

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    return product;
  }

  async findProductBySlug(slug: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { slug, isActive: true },
      relations: [
        'productRemnants',
        'productRemnants.store',
        'productType',
        'categories',
        'discounts',
        'badges',
      ],
    });

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    await this.productRepository.update(id, updateProductDto);
    const product = await this.productRepository.findOneBy({ id: id });
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    return product;
  }

  remove(id: number) {
    return `This action removes the #${id} product`;
  }

  async addBadgeToProduct(
    token: string | any[],
    id: number,
    badgeId: number,
  ): Promise<any> {
    if (!token || typeof token !== 'string') {
      throw new HttpException('Has no access', HttpStatus.FORBIDDEN);
    }

    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['discounts'],
    });

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    const badge = await this.badgeRepository.findOneBy({ id: badgeId });

    if (!badge) {
      throw new HttpException('Badge not found', HttpStatus.NOT_FOUND);
    }

    product.badges.push(badge);
    return await this.productRepository.save(product);
  }

  async addDiscountToProduct(id: number, discountId: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['discounts'],
    });

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    const discount = await this.discountRepository.findOneBy({
      id: discountId,
    });

    if (!discount) {
      throw new HttpException('Discount not found', HttpStatus.NOT_FOUND);
    }

    product.discounts.push(discount);
    return await this.productRepository.save(product);
  }
}
