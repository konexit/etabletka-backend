import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SiteOption } from './entities/site-option.entity';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';
import { UpdateCharacteristic } from './dto/update-characteristic.dto';

@Injectable()
export class SiteOptionService {
  constructor(
    @InjectRepository(SiteOption)
    private siteOptionRepositary: Repository<SiteOption>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private jwtService: JwtService,
  ) {
    this.initFacetSearchMap();
  }

  cacheSiteOptionsKey: string = 'siteOptions';
  cacheSiteOptionsTTL: number = 3600000; // 1Hour

  async characteristicsUpdate(
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

    const {
      json: { attributes },
    } = await this.siteOptionRepositary.findOne({
      where: { key: 'product_attributes_map' },
    });

    //TODO: Here mus be code for update Characteristic in the site option witch has key "product_attributes_map"
  }

  async getActiveSiteOptions(): Promise<any> {
    const cacheSiteOptions = await this.cacheManager.get(
      this.cacheSiteOptionsKey,
    );
    if (cacheSiteOptions) {
      return cacheSiteOptions;
    }

    const siteOptions = await this.siteOptionRepositary.find({
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
    const siteOption = await this.siteOptionRepositary.findOne({
      where: { id },
    });
    if (!siteOption) {
      throw new HttpException('Site option not found', HttpStatus.NOT_FOUND);
    }
    return siteOption;
  }

  async getSiteOptionByKey(key: string): Promise<SiteOption> {
    return await this.siteOptionRepositary.findOne({
      where: { key: key },
    });
  }

  private async initFacetSearchMap(): Promise<void> {
    const {
      json: { attributes, attributesValue },
    } = await this.siteOptionRepositary.findOne({
      select: ['json'],
      where: { key: 'product_attributes_map' },
    });

    await this.cacheManager.set('product_attributes', attributes);
    await this.cacheManager.set('product_attributes_value', attributesValue);
  }
}
