import { Controller, Get, Param } from '@nestjs/common';
import { SiteOptionService } from './site-option.service';
import { SiteOption } from './entities/site-option.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('site-options')
@Controller('api/v1')
export class SiteOptionController {
  constructor(private readonly siteOptionService: SiteOptionService) {}

  @Get('/site-options')
  async getActiveSiteOptions(): Promise<SiteOption[]> {
    return await this.siteOptionService.getActiveSiteOptions();
  }

  @Get('/site-option/:id')
  async getSiteOptionById(@Param('id') id: number) {
    return await this.siteOptionService.getSiteOptionById(+id);
  }

  @Get('/site-option/key/:key')
  async getSiteOptionByKey(
    @Param('key') key: string = 'product_attributes_map',
  ) {
    return await this.siteOptionService.getSiteOptionByKey(key);
  }
}
