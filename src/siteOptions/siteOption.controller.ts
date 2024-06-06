import { Controller, Get, Res } from '@nestjs/common';
import { SiteOptionService } from './siteOption.service';
import { SiteOption } from './entities/siteOption.entity';

@Controller('api/v1/site-options')
export class SiteOptionController {
  constructor(private readonly siteOptionService: SiteOptionService) {}

  @Get()
  async getActiveSiteOptions(@Res() res: any): Promise<SiteOption[]> {
    try {
      const siteOptions = await this.siteOptionService.getActiveSiteOptions();

      if (!siteOptions) {
        return res.status(404).json({ message: 'Site options not found' });
      }

      return res.json(siteOptions);
    } catch (error) {
      return res.status(error.status).json(error);
    }
  }
}
