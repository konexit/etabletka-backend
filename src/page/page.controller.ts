import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { PageService } from './page.service';
import { Request } from 'express';
import { Page } from './entities/page.entiry';

@Controller('api/v1/pages')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Get()
  async getPages(@Req() request: Request, @Res() res): Promise<Page[]> {
    const token = request.headers.authorization?.split(' ')[1] ?? [];
    try {
      const pages = await this.pageService.getPages(token);

      if (!pages) {
        return res.status(404).json({ message: 'Pages not found' });
      }

      return res.json(pages);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  @Get(':slug')
  async getPageBySlug(@Param('slug') slug: string, @Res() res): Promise<Page> {
    try {
      const page = await this.pageService.getPageBySlug(slug);

      if (!page) {
        return res.status(404).json({ message: 'Page not found' });
      }

      return res.json(page);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
