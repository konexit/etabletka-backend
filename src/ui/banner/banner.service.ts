import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Banner } from './entities/banner.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(Banner)
    private bannerRepository: Repository<Banner>,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  cacheBannerKey = 'banners';
  cacheBannerTTL = 14400000; // 4 Hour

  async getPublishedBanners(): Promise<any> {
    const cacheBanners = await this.cacheManager.get(this.cacheBannerKey);
    if (cacheBanners) {
      return cacheBanners;
    }

    const banners = await this.bannerRepository.find({
      where: { isPublished: true },
    });

    if (!banners) {
      throw new HttpException('Banners not found', HttpStatus.NOT_FOUND);
    }

    await this.cacheManager.set(
      this.cacheBannerKey,
      banners,
      this.cacheBannerTTL,
    );

    return banners;
  }

  async findBannerBySlug(slug: string): Promise<Banner> | undefined {
    const banner = await this.bannerRepository.findOneBy({ slug });

    if (!banner) {
      throw new HttpException('Banner not found', HttpStatus.NOT_FOUND);
    }

    return banner;
  }
}
