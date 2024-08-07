import { Controller, Get } from '@nestjs/common';
import { SiteOptionService } from './site-option.service';
import { SiteOption } from './entities/site-option.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('site-options')
@Controller('api/v1/site-options')
export class SiteOptionController {
  constructor(private readonly siteOptionService: SiteOptionService) {}

  @Get()
  async getActiveSiteOptions(): Promise<SiteOption[]> {
    return await this.siteOptionService.getActiveSiteOptions();
  }
}
