import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SiteOption } from './entities/site-option.entity';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SiteOptionService {
  constructor(
    @InjectRepository(SiteOption)
    private siteOptionRepositary: Repository<SiteOption>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private jwtService: JwtService,
  ) {}

  cacheSiteOptionsKey: string = 'siteOptions';
  cacheSiteOptionsTTL: number = 3600000; // 1Hour

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
}
