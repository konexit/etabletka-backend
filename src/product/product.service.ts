import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { TransformAttributes } from 'src/common/decorators/transform-attributes';
import { In, Repository } from 'typeorm';
import { Badge } from '../badge/entities/badge.entity';
import { PaginationDto } from '../common/dto/paginationDto';
import { Discount } from '../discount/entities/discount.entity';
import { Product } from './entities/product.entity';
import { CreateProduct } from './dto/create-product.dto';
import { UpdateProduct } from './dto/update-product.dto';
import { Category } from '../categories/entities/category.entity';
import { ProductGroup } from '../productGroup/entities/product-group.entity';
import { ProductRemnant } from '../productRemnants/entities/product-remnant.entity';

@Injectable()
export class ProductService {
  private priceConfig: PriceConfig;

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
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.priceConfig = JSON.parse(this.configService.get('PRICE_CONFIG'));
  }

  cacheSalesProductsKey = 'salesProducts';
  cacheProductsTTL = 7200000; // 2Hour

  async create(createProduct: CreateProduct): Promise<Product> {
    const product = this.productRepository.create(createProduct);
    await this.productRepository.save(product);
    console.log('PRODUCT', product);
    return product;
  }

  async update(
    token: string,
    id: number,
    updateProduct: UpdateProduct,
    lang: string = 'uk',
  ): Promise<Product> {
    if (!token || typeof token !== 'string') {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const payload = await this.jwtService.decode(token);
    if (payload.roleId !== 1) {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const productBadgeIds = updateProduct.badges;
    delete updateProduct.badges;

    const productCategoryIds = updateProduct.categories;
    delete updateProduct.categories;

    const productDiscountIds = updateProduct.discounts;
    delete updateProduct.discounts;

    const productGroupIds = updateProduct.productGroups;
    delete updateProduct.productGroups;

    const productRemnantIds = updateProduct.productRemnants;
    delete updateProduct.productRemnants;

    await this.productRepository.update(id, updateProduct);
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['badges', 'categories', 'discounts', 'productGroups'],
    });
    if (!product) {
      throw new HttpException(
        `Can't update product with data: ${updateProduct}`,
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

    if (productCategoryIds) {
      if (!Array.isArray(productCategoryIds)) {
        const ids: Array<number> = String(productCategoryIds)
          .split(',')
          .map(Number);

        product.categories = await this.addCategories(ids);
      } else {
        product.categories = await this.addCategories(productCategoryIds);
      }
    } else {
      product.categories = [];
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

    if (productGroupIds) {
      if (!Array.isArray(productGroupIds)) {
        const ids: Array<number> = String(productGroupIds)
          .split(',')
          .map(Number);

        product.productGroups = await this.addProductGroups(ids);
      } else {
        product.productGroups = await this.addProductGroups(productGroupIds);
      }
    } else {
      product.productGroups = [];
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
    categoryId: number,
    lang: string = 'uk',
  ): Promise<Product[]> {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'categories')
      .leftJoinAndSelect('product.discounts', 'discount')
      .leftJoinAndSelect('product.badges', 'badges')
      .leftJoinAndSelect('product.productRemnants', 'productRemnants')
      .leftJoinAndSelect('product.productGroups', 'productGroups')
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
    orderBy: any = {},
    where: any = {},
    lang: string = 'uk',
  ) {
    if (!token || typeof token !== 'string') {
      const products = await this.productRepository.find({
        where: { isActive: true },
        relations: [
          'productGroups',
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
    if (payload.roleId !== 1) {
      return await this.productRepository.find({
        where: { isActive: true },
        relations: [
          'productGroups',
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
        queryBuilder.orderBy(`langname`, orderBy?.orderName);
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
            discount.isActive,
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

  async getProductByIdForUser(id) {
    return await this.productRepository.findOne({
      where: { id, isActive: true },
      relations: [
        'productGroups',
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

  @TransformAttributes('uk')
  async findProductById(
    token: string,
    id: number,
    lang: string = 'uk',
  ): Promise<Product> {
    let product = await this.getProductByIdForUser(id);

    const payload = await this.jwtService.decode(token);
    if (payload?.roleId === 1) {
      product = await this.productRepository.findOne({
        where: { id },
        relations: [
          'productGroups',
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

        discount.name = discount.name[lang];
      }
    }

    if (product.categories) {
      for (const category of product.categories) {
        category.name = category?.name[lang];
      }
    }

    product.name = product?.name[lang];
    product.shortName = product?.shortName[lang];
    if (product.seoTitle) product.seoTitle = product.seoTitle[lang];
    if (product.seoDescription)
      product.seoDescription = product.seoDescription[lang];
    if (product.brand) product.brand.name = product.brand?.name[lang];

    return product;
  }

  @TransformAttributes('uk')
  async findProductBySlug(slug: string, lang: string = 'uk'): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: {
        slug,
        isActive: true,
      },
      relations: [
        'productGroups',
        'productRemnants',
        'productRemnants.store',
        'productType',
        'categories',
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

  async addBadgeToProduct(
    token: string,
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
