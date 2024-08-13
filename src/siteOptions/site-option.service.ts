import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SiteOption } from './entities/site-option.entity';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';
import { UpdateCharacteristic } from './dto/update-characteristic.dto';
import { CreateCharacteristic } from './dto/create-characteristic.dto';
import { CreateValue } from './dto/create-value.dto';
import { UpdateValue } from './dto/update-value.dto';

@Injectable()
export class SiteOptionService {
  private readonly logger = new Logger(SiteOptionService.name);
  private productAttributeConfig: productAttributeConfig = {
    attrKey: 'attributes',
    attrValueKey: 'attributesValue',
    attrKeyCache: 'product_attributes',
    valueKeyCache: 'product_attributes_value',
    default: {
      key: 'product_attributes_map',
      title: 'Транслітерація характеристик товарів',
      type: 'json',
      primary: 1,
      isEditable: 1,
      switchable: 0,
      position: 0,
      isActive: 0,
      value: null,
      json: {
        attributes: [],
        attributesValue: []
      }
    }
  }
  private cacheSiteOptionsKey: string = 'siteOptions';
  private cacheSiteOptionsTTL: number = 3600000; // 1Hour

  constructor(
    @InjectRepository(SiteOption)
    private siteOptionRepository: Repository<SiteOption>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private jwtService: JwtService,
  ) {
    this.initFacetSearchMap();
  }

  async characteristicCreate(
    token: string | any[],
    createCharacteristic: CreateCharacteristic,
  ) {
    if (!token || typeof token !== 'string') {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const payload = await this.jwtService.decode(token);
    if (payload.roleId !== 1) {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    if (!(await this.unique(this.productAttributeConfig.attrKey, createCharacteristic.key))) {
      throw new HttpException('You are creating a duplicate characteristic', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    await this.setProductAttributesMap(this.productAttributeConfig.attrKey, createCharacteristic.key, createCharacteristic.attribute);
    await this.moveFacetSearchMapToCache(this.productAttributeConfig.attrKeyCache);
  }

  async valueCreate(token: string | any[], createValue: CreateValue) {
    if (!token || typeof token !== 'string') {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const payload = await this.jwtService.decode(token);
    if (payload.roleId !== 1) {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    if (!(await this.unique(this.productAttributeConfig.attrValueKey, createValue.key))) {
      throw new HttpException('You are creating a duplicate attributes value', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    await this.setProductAttributesMap(this.productAttributeConfig.attrValueKey, createValue.key, createValue.attributeValue);
    await this.moveFacetSearchMapToCache(this.productAttributeConfig.valueKeyCache);
  }

  async characteristicUpdate(
    token: string | any[],
    key: string,
    updateCharacteristic: UpdateCharacteristic,
  ) {
    if (!token || typeof token !== 'string') {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const payload = await this.jwtService.decode(token);
    if (payload.roleId !== 1) {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    await this.setProductAttributesMap(this.productAttributeConfig.attrKey, key, updateCharacteristic.attribute);
    await this.moveFacetSearchMapToCache(this.productAttributeConfig.attrKeyCache);
  }

  async valueUpdate(
    token: string | any[],
    key: string,
    updateValue: UpdateValue,
  ) {
    if (!token || typeof token !== 'string') {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const payload = await this.jwtService.decode(token);
    if (payload.roleId !== 1) {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    await this.setProductAttributesMap(this.productAttributeConfig.attrValueKey, key, updateValue.attributeValue);
    await this.moveFacetSearchMapToCache(this.productAttributeConfig.valueKeyCache);
  }

  async getActiveSiteOptions(): Promise<any> {
    const cacheSiteOptions = await this.cacheManager.get(
      this.cacheSiteOptionsKey,
    );
    if (cacheSiteOptions) {
      return cacheSiteOptions;
    }

    const siteOptions = await this.siteOptionRepository.find({
      where: { isActive: 1 },
    });

    if (!siteOptions) {
      throw new HttpException('Site options not found', HttpStatus.NOT_FOUND);
    }

    await this.cacheManager.set(
      this.cacheSiteOptionsKey,
      siteOptions,
      this.cacheSiteOptionsTTL,
    );

    return siteOptions;
  }

  async getSiteOptionById(id: number) {
    const siteOption = await this.siteOptionRepository.findOne({
      where: { id },
    });
    if (!siteOption) {
      throw new HttpException('Site option not found', HttpStatus.NOT_FOUND);
    }
    return siteOption;
  }

  async getSiteOptionByKey(key: string): Promise<SiteOption> {
    return await this.siteOptionRepository.findOne({
      where: { key: key },
    });
  }

  private async initFacetSearchMap(): Promise<void> {
    if (await this.unique()) {
      await this.siteOptionRepository.save(this.siteOptionRepository.create(<FacetSearchMap>this.productAttributeConfig.default));
    }

    await this.moveFacetSearchMapToCache();
  }

  private async moveFacetSearchMapToCache(key: string = 'all'): Promise<void> {
    const {
      json: { attributes, attributesValue },
    } = await this.siteOptionRepository.findOne({
      select: [this.productAttributeConfig.default.type],
      where: { key: this.productAttributeConfig.default.key },
    });

    if (key === 'all' || key === this.productAttributeConfig.attrKeyCache) {
      await this.cacheManager.set(this.productAttributeConfig.attrKeyCache, attributes);
    }

    if (key === 'all' || key === this.productAttributeConfig.valueKeyCache) {
      await this.cacheManager.set(this.productAttributeConfig.valueKeyCache, attributesValue);
    }

    this.logger.log(`facet-search key: '${key}' successfully added to cache`);
  }

  private async unique(targetKey?, key?: string): Promise<boolean> {
    let builder = this.siteOptionRepository
      .createQueryBuilder('site_options')
      .where('site_options.key = :key', { key: this.productAttributeConfig.default.key });
    if (key && key) {
      builder = builder.andWhere(`site_options.json->'${targetKey}' ? :${key}`, { [key]: key });
    }
    return !(await builder.getCount());
  }

  private async setProductAttributesMap(targetKey, key: string, value: any): Promise<void> {
    await this.siteOptionRepository
      .createQueryBuilder()
      .update('site_options')
      .set({
        json: () => `jsonb_set(json, '{${targetKey},${key}}', '${JSON.stringify(value)}', true)`
      })
      .where("key = :key", { key: this.productAttributeConfig.default.key })
      .execute();
  }
}
