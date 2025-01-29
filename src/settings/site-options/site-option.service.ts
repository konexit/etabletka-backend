import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SiteOption } from './entities/site-option.entity';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SiteOptionService {
  private readonly logger = new Logger(SiteOptionService.name);
  private cacheSiteOptionsKey: string = 'siteOptions';
  private cacheSiteOptionsTTL: number = 3600000; // 1Hour

  constructor(
    @InjectRepository(SiteOption)
    private siteOptionRepository: Repository<SiteOption>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private jwtService: JwtService,
  ) { }

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
}
