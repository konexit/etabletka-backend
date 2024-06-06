import { Controller, Get, Param, Res } from '@nestjs/common';
import { BannerService } from './banner.service';
import { Banner } from './entities/banner.entity';

@Controller('api/v1/banners')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Get()
  async getPublishedBanners(@Res() res: any): Promise<Banner[]> | undefined {
    try {
      const banners = await this.bannerService.getPublishedBanners();

      if (!banners) {
        return res.status(404).json({ message: 'Banner not found' });
      }

      return res.json(banners);
    } catch (error) {
      return res.status(error.status).json(error);
    }
  }

  @Get(':slug')
  async getBannerBySlug(
    @Param('slug') slug: string,
    @Res() res: any,
  ): Promise<Banner> | undefined {
    try {
      const banner = await this.bannerService.findBannerBySlug(slug);

      if (!banner) {
        return res.status(404).json({ message: 'Banner not found' });
      }

      return res.json(banner);
    } catch (error) {
      return res.status(error.status).json(error);
    }
  }
}
