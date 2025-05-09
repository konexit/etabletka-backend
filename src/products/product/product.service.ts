import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import {
  TransformAttributes,
  TransformAttributesOptions,
} from 'src/common/decorators/transform-attributes';
import { In, Repository } from 'typeorm';
import { Badge } from '../badge/entities/badge.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Discount } from 'src/promo/discount/entities/discount.entity';
import { Product } from './entities/product.entity';
import { CreateProduct } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Category } from 'src/categories/entities/category.entity';
import { ProductGroup } from 'src/products/groups/entities/product-group.entity';
import { ProductRemnant } from 'src/products/remnants/entities/product-remnant.entity';
import { JwtPayload } from 'src/common/types/jwt/jwt.interfaces';
import { USER_ROLE_JWT_ADMIN } from 'src/user/user.constants';
import { Comment } from 'src/comment/entities/comment.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
    @InjectRepository(Badge)
    private readonly badgeRepository: Repository<Badge>,
    @InjectRepository(ProductGroup)
    private readonly productGroupRepository: Repository<ProductGroup>,
    @InjectRepository(ProductRemnant)
    private readonly productRemnantRepository: Repository<ProductRemnant>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  cacheSalesProductsKey = 'salesProducts';
  cacheProductsTTL = 7200000; // 2Hour

  async create(createProduct: CreateProduct): Promise<Product> {
    const product = this.productRepository.create(createProduct);
    await this.productRepository.save(product);
    return product;
  }

  async update(
    token: string,
    id: number,
    updateProductDto: UpdateProductDto,
    lang = 'uk',
  ): Promise<Product> {
    if (!token || typeof token !== 'string') {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const payload = await this.jwtService.decode(token);
    if (payload?.roleId !== 1) {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const productBadgeIds = updateProductDto.badges;
    delete updateProductDto.badges;

    const productDiscountIds = updateProductDto.discounts;
    delete updateProductDto.discounts;

    const productRemnantIds = updateProductDto.productRemnants;
    delete updateProductDto.productRemnants;

    await this.productRepository.update(id, updateProductDto);
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['badges', 'categories', 'discounts'],
    });
    if (!product) {
      throw new HttpException(
        `Can't update product with data: ${updateProductDto}`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (productBadgeIds) {
      if (!Array.isArray(productBadgeIds)) {
        const ids: Array<number> = String(productBadgeIds)
          .split(',')
          .map(Number);

        product.badges = await this.addBadges(ids);
      } else {
        product.badges = await this.addBadges(productBadgeIds);
      }
    } else {
      product.badges = [];
    }

    if (productDiscountIds) {
      if (!Array.isArray(productDiscountIds)) {
        const ids: Array<number> = String(productDiscountIds)
          .split(',')
          .map(Number);

        product.discounts = await this.addDiscounts(ids);
      } else {
        product.discounts = await this.addDiscounts(productDiscountIds);
      }
    } else {
      product.discounts = [];
    }

    if (productRemnantIds) {
      //TODO
    } else {
      product.productRemnants = [];
    }

    const productUpd: Product = await this.productRepository.save(product);

    productUpd.name = productUpd?.name[lang];
    productUpd.shortName = productUpd?.shortName[lang];

    return productUpd;
  }

  remove(id: number) {
    return `This action removes the #${id} product`;
  }

  async addBadges(ids: Array<number>) {
    return await this.badgeRepository.find({
      where: { id: In(ids) },
    });
  }

  async addCategories(ids: Array<number>) {
    return await this.categoryRepository.find({
      where: { id: In(ids) },
    });
  }

  async addDiscounts(ids: Array<number>) {
    return await this.discountRepository.find({
      where: { id: In(ids) },
    });
  }

  async addProductGroups(ids: Array<number>) {
    return await this.productGroupRepository.find({
      where: { id: In(ids) },
    });
  }

  async getProductStats(
    productId: Product['id'],
  ): Promise<[number, number, number, number, number]> {
    const query = `
        SELECT array_agg(COALESCE(c.cnt, 0)::int ORDER BY r.rating) AS "productStats"
        FROM generate_series(1, 5) AS r(rating)
        LEFT JOIN (
        SELECT rating, COUNT(*) AS cnt
        FROM comments
        WHERE type = 'product'
            AND approved = true
            AND model_id = $1
        GROUP BY rating
        ) AS c
        ON r.rating = c.rating;
    `;

    const result = await this.commentRepository.query(query, [productId]);

    return result[0].productStats;
  }

  async getProductBySyncId(syncId: number, lang = 'uk'): Promise<Product> {
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
    categoryId: number,
    lang = 'uk',
  ): Promise<Product[]> {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'categories')
      .leftJoinAndSelect('product.discounts', 'discount')
      .leftJoinAndSelect('product.badges', 'badges')
      .leftJoinAndSelect('product.productRemnants', 'productRemnants')
      .where('product.isActive = :isActive', { isActive: true })
      .andWhere('categories.id = :categoryId', { categoryId: categoryId })
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

  async findAll(
    token: string,
    pagination: PaginationDto = {},
    orderBy: {
      [key: string]: 'ASC' | 'DESC';
    } = {},
    where = {},
    lang = 'uk',
  ) {
    if (!token || typeof token !== 'string') {
      const products = await this.productRepository.find({
        where: { isActive: true },
        relations: [
          'productRemnants',
          'productRemnants.store',
          'productType',
          'categories',
          'discounts',
          'badges',
          'brand',
        ],
      });
      for (const product of products) {
        product.name = product?.name[lang];
        product.shortName = product?.shortName[lang];
      }
      return products;
    }
    const payload = await this.jwtService.decode(token);
    if (payload?.roleId !== 1) {
      return await this.productRepository.find({
        where: { isActive: true },
        relations: [
          'productRemnants',
          'productRemnants.store',
          'productType',
          'categories',
          'discounts',
          'badges',
          'brand',
        ],
      });
    }

    /** ADMIN **/
    const { take = 16, skip = 0 } = pagination;
    const queryBuilder = this.productRepository.createQueryBuilder('products');
    queryBuilder
      .select('products')
      .addSelect(`(products.name->'${lang}')::varchar`, 'langname')
      .leftJoinAndSelect('products.categories', 'categories')
      .leftJoinAndSelect('products.discounts', 'discount')
      .leftJoinAndSelect('products.badges', 'badges')
      .leftJoinAndSelect('products.productRemnants', 'productRemnants')
      .leftJoinAndSelect('products.brand', 'brand')
      .where('products.id is not null');

    /** Where statements **/
    if (where) {
    }

    /** Order by statements **/
    if (orderBy) {
      if (orderBy?.orderName) {
        queryBuilder.orderBy('langname', orderBy?.orderName);
      }
    }

    queryBuilder.take(+take).skip(+skip);

    const products: Product[] = await queryBuilder.getMany();
    if (!products) {
      throw new HttpException('Products not found', HttpStatus.NOT_FOUND);
    }

    const total = await queryBuilder.getCount();
    return {
      products,
      pagination: { total, take, skip },
    };
  }

  async findDiscountProducts(lang = 'uk') {
    // TODO: implement product discount system logic after ToR
    const limit = Math.floor(Math.random() * (10 - 5 + 1)) + 5;

    const products = await this.productRepository
      .createQueryBuilder('product')
      .select('product.id')
      .where('product.isActive = :isActive', { isActive: true })
      .innerJoin('product.discounts', 'discount')
      .groupBy('product.id')
      .orderBy('RANDOM()')
      .limit(limit)
      .getMany();

    return products.map((product) => product.id);
  }

  async findPopularProducts() {
    // TODO: implement popular products logic after ToR
    const limit = Math.floor(Math.random() * (10 - 5 + 1)) + 5;

    const products = await this.productRepository
      .createQueryBuilder('product')
      .select('product.id')
      .where('product.isActive = :isActive', { isActive: true })
      .orderBy('RANDOM()')
      .limit(limit)
      .getMany();

    return products.map((product) => product.id);
  }

  @TransformAttributes('uk', 2)
  async findProductById(
    jwtPayload: JwtPayload,
    id: number,
    options: TransformAttributesOptions,
  ): Promise<Product> {
    const isAdmin = jwtPayload?.roles?.includes(USER_ROLE_JWT_ADMIN);
    const product = await this.productRepository.findOne({
      where: isAdmin ? { id } : { id, isActive: true },
      relations: [
        'productRemnants',
        'productRemnants.store',
        'productType',
        'discounts',
        'badges',
        'brand',
      ],
    });

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    /*** Calculate discountPrice ***/
    if (product.discounts) {
      for (const discount of product.discounts) {
        discount.discountPrice = this.calculateDiscountPrice(
          product.price,
          discount.type,
          discount.value,
          discount.isActive,
        );

        discount.name = discount.name[options.lang];
      }
    }

    product.name = product?.name[options.lang];
    product.shortName = product?.shortName[options.lang];
    if (product.seoTitle) product.seoTitle = product.seoTitle[options.lang];
    if (product.seoDescription)
      product.seoDescription = product.seoDescription[options.lang];
    if (product.brand) product.brand.name = product.brand?.name[options.lang];

    return product;
  }

  @TransformAttributes('uk')
  async findProductByIds(
    productIds: number[],
    options: TransformAttributesOptions,
  ): Promise<Product[]> {
    const products = await this.productRepository.find({
      where: { id: In(productIds), isActive: true },
      relations: [
        'productRemnants',
        'productRemnants.store',
        'productType',
        'discounts',
        'badges',
        'brand',
      ],
    });

    if (!products) {
      throw new HttpException('Products not found', HttpStatus.NOT_FOUND);
    }

    for (const product of products) {
      if (product.discounts) {
        for (const discount of product.discounts) {
          discount.discountPrice = this.calculateDiscountPrice(
            product.price,
            discount.type,
            discount.value,
            discount.isActive,
          );

          discount.name = discount.name[options.lang];
        }
      }

      product.name = product?.name[options.lang];
      product.shortName = product?.shortName[options.lang];
      if (product.seoTitle) product.seoTitle = product.seoTitle[options.lang];
      if (product.seoDescription)
        product.seoDescription = product.seoDescription[options.lang];
      if (product.brand) product.brand.name = product.brand?.name[options.lang];
    }

    return products;
  }

  @TransformAttributes('uk')
  async findProductBySlug(slug: string, lang = 'uk'): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: {
        slug,
        isActive: true,
      },
      relations: [
        'productRemnants',
        'productRemnants.store',
        'productType',
        'discounts',
        'badges',
        'brand',
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

  async addBadgeToProduct(token: string, id: number, badgeId: number) {
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
    // if (productPrice > 0 && discountActive) {
    //   if (discountType === 1) {
    //     return productPrice - (productPrice * discountValue) / 100;
    //   }
    //
    //   if (discountType === 2) {
    //     return productPrice - discountValue;
    //   }
    // }
    return 0;
  }
}
