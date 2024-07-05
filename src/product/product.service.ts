import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Badge } from '../badge/entities/badge.entity';
import { Discount } from '../discount/entities/discount.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Discount)
    private discountRepository: Repository<Discount>,
    @InjectRepository(Badge)
    private readonly badgeRepository: Repository<Badge>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private jwtService: JwtService,
  ) {}

  cacheSalesProductsKey = 'salesProducts';
  cacheProductsTTL = 7200000; // 2Hour

  async getProductBySyncId(
    syncId: number,
    lang: string = 'uk',
  ): Promise<Product> {
    if (!syncId)
      throw new HttpException(
        'The syncId is not define',
        HttpStatus.BAD_REQUEST,
      );

    const product = await this.productRepository.findOneBy({ syncId: syncId });
    if (!product) {
      throw new HttpException(
        'Product with this syncId does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    product.name = product?.name[lang];
    product.shortName = product?.shortName[lang];
    return product;
  }

  async getProductsByCategoryId(
    categoryId,
    lang: string = 'uk',
  ): Promise<Product[]> {
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
    for (const product of products) {
      product.name = product?.name[lang];
      product.shortName = product?.shortName[lang];
    }
    return products;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    await this.productRepository.save(product);
    console.log('PRODUCT', product);
    return product;
  }

  async findAll(token: string | any[], lang: string = 'uk') {
    if (!token || typeof token !== 'string') {
      const products = await this.productRepository.find({
        where: { isActive: true },
      });
      for (const product of products) {
        product.name = product?.name[lang];
        product.shortName = product?.shortName[lang];
      }
      return products;
    }
    const payload = await this.jwtService.decode(token);
    if (payload.roleId === 1) {
      return await this.productRepository.find({
        where: { isActive: true },
      });
    }
    return await this.productRepository.find({});
  }

  async findAllSales(lang: string = 'uk'): Promise<any> {
    const cacheSalesProducts = await this.cacheManager.get(
      this.cacheSalesProductsKey,
    );
    if (cacheSalesProducts) {
      return cacheSalesProducts;
    }
    const queryBuilder = this.productRepository.createQueryBuilder('product');

    queryBuilder.leftJoinAndSelect('product.discounts', 'discount');
    queryBuilder.leftJoinAndSelect(
      'product.productRemnants',
      'productRemnants',
    );
    queryBuilder.andWhere('productRemnants.isActive = :isActive', {
      isActive: true,
    });
    queryBuilder.where('discount.id IS NOT NULL');
    queryBuilder.andWhere('discount.isActive = :isActive', { isActive: true });

    const products = await queryBuilder.getMany();
    for (const product of products) {
      product.name = product?.name[lang];
      product.shortName = product?.shortName[lang];

      /*** Calculate discountPrice ***/
      if (product.discounts) {
        for (const discount of product.discounts) {
          discount.discountPrice = this.calculateDiscountPrice(
            product.price,
            discount.type,
            discount.value,
          );
        }
      }
    }

    await this.cacheManager.set(
      this.cacheSalesProductsKey,
      products,
      this.cacheProductsTTL,
    );

    return products;
  }

  async findPopular(lang: string = 'uk') {
    //TODO: Make it from orders
    const queryBuilder = this.productRepository.createQueryBuilder('product');

    queryBuilder.leftJoinAndSelect('product.discounts', 'discount');
    queryBuilder.leftJoinAndSelect(
      'product.productRemnants',
      'productRemnants',
    );
    queryBuilder.where('discount.id IS NOT NULL');
    queryBuilder.andWhere('discount.isActive = :isActive', { isActive: true });
    queryBuilder.andWhere('productRemnants.isActive = :isActive', {
      isActive: true,
    });
    queryBuilder.andWhere('product.syncId IN(:...ids)', {
      ids: [52462, 40670, 518, 57758, 2724, 40556, 50006],
    });

    const products = await queryBuilder.getMany();

    for (const product of products) {
      product.name = product?.name[lang];
      product.shortName = product?.shortName[lang];

      /*** Calculate discountPrice ***/
      if (product.discounts) {
        for (const discount of product.discounts) {
          discount.discountPrice = this.calculateDiscountPrice(
            product.price,
            discount.type,
            discount.value,
            discount.isActive,
          );
        }
      }
    }

    return products;
  }

  async findProductById(id: number, lang: string = 'uk'): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id, isActive: true },
      relations: ['productRemnants'],
    });

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    product.name = product?.name[lang];
    product.shortName = product?.shortName[lang];
    return product;
  }

  async findProductBySlug(slug: string, lang: string = 'uk'): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: {
        slug,
        isActive: true,
        discounts: { isActive: true },
        productRemnants: { isActive: true },
      },
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

    product.name = product?.name[lang];
    product.shortName = product?.shortName[lang];

    /*** Calculate discountPrice ***/
    if (product.discounts) {
      for (const discount of product.discounts) {
        discount.discountPrice = this.calculateDiscountPrice(
          product.price,
          discount.type,
          discount.value,
          discount.isActive,
        );
      }
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

  calculateDiscountPrice(
    productPrice: number,
    discountType: number,
    discountValue: number,
    discountActive: boolean,
  ): number {
    if (productPrice > 0 && discountActive) {
      if (discountType === 0) {
        return productPrice - (productPrice * discountValue) / 100;
      }

      if (discountType === 1) {
        return productPrice - discountValue;
      }
    }
    return 0;
  }
}
