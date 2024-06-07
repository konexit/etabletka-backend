import { Controller, Get, Param, Req } from '@nestjs/common';
import { PageService } from './page.service';
import { Request } from 'express';
import { Page } from './entities/page.entity';

@Controller('api/v1/pages')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Get()
  async getPages(@Req() request: Request): Promise<Page[]> {
    const token = request.headers.authorization?.split(' ')[1] ?? [];

    return await this.pageService.getPages(token);
  }

  @Get(':slug')
  async getPageBySlug(@Param('slug') slug: string): Promise<Page> {
    return await this.pageService.getPageBySlug(slug);
  }
}
