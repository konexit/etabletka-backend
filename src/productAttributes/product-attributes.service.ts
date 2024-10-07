import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ProductAttributes } from './entities/product-attributes.entity';
import { UpdateProductAttributes } from './dto/update-product-attributes.dto';
import { CacheKeys } from 'src/refresh/refresh-keys';

@Injectable()
export class ProductAttributesService {
  private readonly logger = new Logger(ProductAttributesService.name);
  constructor(
    @InjectRepository(ProductAttributes)
    private readonly productAttributesRepository: Repository<ProductAttributes>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache
  ) {
    this.cacheInit();
  }

  async create(createProductAttributes: ProductAttributes): Promise<any> {
    try {
      return await this.productAttributesRepository.save(this.productAttributesRepository.create(createProductAttributes));
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.CONFLICT);
    }
  }

  async update(id: number, updateProductAttributes: UpdateProductAttributes): Promise<UpdateResult> {
    try {
      return await this.productAttributesRepository.update(id, updateProductAttributes);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.CONFLICT);
    }
  }

  async remove(id: number): Promise<DeleteResult> {
    return this.productAttributesRepository.delete(id);
  }

  async findAll(): Promise<ProductAttributes[]> {
    return this.productAttributesRepository.find({
      order: {
        order: 'ASC'
      }
    });
  }

  async findById(id: number): Promise<ProductAttributes> {
    return this.productAttributesRepository.findOne({ where: { id } });
  }

  async getAllFormatMap() {
    return (await this.findAll()).reduce((acc, current) => {
      acc[current.key] = current
      return acc;
    }, {})
  }

  async cacheInit() {
    this.cacheManager.set(CacheKeys.ProductAttributes, await this.getAllFormatMap());
    const logMsg = `cache key '${CacheKeys.ProductAttributes}' was successfully added`;
    this.logger.log(logMsg);
    return logMsg;
  }
}
