import { Controller, Get } from '@nestjs/common';
import { SiteOptionService } from './siteOption.service';
import { SiteOption } from './entities/siteOption.entity';

@Controller('api/v1/site-options')
export class SiteOptionController {
  constructor(private readonly siteOptionService: SiteOptionService) {}

  @Get()
  async getActiveSiteOptions(): Promise<SiteOption[]> {
    return await this.siteOptionService.getActiveSiteOptions();
  }
}
