import { Controller, Get, Param, Patch, Post, Req } from "@nestjs/common";
import { SiteOptionService } from './site-option.service';
import { SiteOption } from './entities/site-option.entity';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('site-options')
@Controller('api/v1')
export class SiteOptionController {
  constructor(private readonly siteOptionService: SiteOptionService) { }

  @Post('/site-option/create')
  async create(@Req() request: Request) { }

  @Patch('/site-option/update/:id')
  async update(@Req() request: Request, @Param('id') id: number) { }

  @Get('/site-options')
  async getActiveSiteOptions(): Promise<SiteOption[]> {
    return await this.siteOptionService.getActiveSiteOptions();
  }

  @Get('/site-option/:id')
  async getSiteOptionById(@Param('id') id: number) {
    return await this.siteOptionService.getSiteOptionById(+id);
  }

  @Get('/site-option/key/:key')
  async getSiteOptionByKey(@Param('key') key: string) {
    return await this.siteOptionService.getSiteOptionByKey(key);
  }
}
