import { Controller, Get, Param } from '@nestjs/common';
import { BannerService } from './banner.service';
import { Banner } from './entities/banner.entity';

@Controller('api/v1/banners')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Get()
  async getPublishedBanners(): Promise<Banner[]> | undefined {
    return await this.bannerService.getPublishedBanners();
  }

  @Get(':slug')
  async getBannerBySlug(@Param('slug') slug: string): Promise<Banner> {
    return await this.bannerService.findBannerBySlug(slug);
  }
}
