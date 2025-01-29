import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProductRemnant } from './entities/product-remnant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Store } from 'src/stores/store/entities/store.entity';
import { CreateProductRemnant } from './dto/create-product-remnant.dto';
import { UpdateProductRemnant } from './dto/update-product-remnant.dto';

@Injectable()
export class ProductRemnantService {
  constructor(
    @InjectRepository(ProductRemnant)
    private productRemnantsRepository: Repository<ProductRemnant>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
  ) {}

  async create(
    createProductRemnantsDto: CreateProductRemnant,
  ): Promise<ProductRemnant> {
    const productRemnant = this.productRemnantsRepository.create(
      createProductRemnantsDto,
    );
    await this.productRemnantsRepository.save(productRemnant);
    console.log('ProductRemnant', productRemnant);
    return productRemnant;
  }

  async update(
    id: number,
    updateProductRemnantDto: UpdateProductRemnant,
  ): Promise<ProductRemnant> {
    await this.productRemnantsRepository.update(id, updateProductRemnantDto);
    const productRemnant = await this.productRemnantsRepository.findOneBy({
      id: id,
    });

    if (!productRemnant) {
      throw new HttpException(
        'Product remnant not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return productRemnant;
  }

  remove(id: number) {
    return `This action removes the #${id} product remnant`;
  }

  async getProductRemnantsByProductId(productId: number) {
    if (!productId)
      throw new HttpException(
        'The productId is not define',
        HttpStatus.BAD_REQUEST,
      );

    const productRemnants = await this.productRemnantsRepository.findBy({
      productId: productId,
    });

    if (!productRemnants) {
      throw new HttpException(
        'Product with this syncId does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    return productRemnants;
  }

  async findAll(token: string | any[]): Promise<ProductRemnant[]> {
    if (!token || typeof token !== 'string') {
      throw new HttpException('No access', HttpStatus.FORBIDDEN);
    }
    return await this.productRemnantsRepository.find();
  }

  async findOne(id: number): Promise<ProductRemnant> {
    const productRemnant = await this.productRemnantsRepository.findOneBy({
      id: id,
    });

    if (!productRemnant) {
      throw new HttpException(
        'Product with this syncId does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    return productRemnant;
  }

  async findProductRemnantsInStore(
    productId: number,
    storeId: number,
  ): Promise<ProductRemnant> {
    const productRemnants = await this.productRemnantsRepository.findOne({
      where: { productId: productId, storeId: storeId },
    });

    if (!productRemnants) {
      throw new HttpException(
        'Product remnants not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return productRemnants;
  }

  async findProductRemnantsInCity(
    productId: number,
    cityId: number,
  ): Promise<ProductRemnant[]> {
    const stores = await this.storeRepository
      .createQueryBuilder('store')
      .select('store.id')
      .where('store.cityId = :cityId', { cityId: cityId })
      .getMany();

    if (!stores) {
      throw new HttpException(
        'City does not have any stores',
        HttpStatus.NOT_FOUND,
      );
    }

    const storeIds = stores.map((item) => item.id);

    const productRemnants = await this.productRemnantsRepository.find({
      where: {
        productId: productId,
        storeId: In(storeIds),
      },
    });

    if (!productRemnants) {
      throw new HttpException(
        'Product remnants not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return productRemnants;
  }
}
