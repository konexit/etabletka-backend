import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { ResponsePageDto } from './dto/response-page.dto';
import { Page } from './entities/page.entity';
import { PageService } from './page.service';

@ApiTags('pages')
@Controller('api/v1')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Get('/pages')
  async getPages(@Req() request: Request): Promise<Page[]> {
    const token = request.headers.authorization?.split(' ')[1] ?? '';

    return await this.pageService.getPages(token);
  }

  @Get('/pages/menu/:index')
  async getPagesByMenuIndex(@Param('index') index: number) {
    return await this.pageService.getPagesByMenuIndex(index);
  }

  @Get('/page/:slug')
  @UseInterceptors(ClassSerializerInterceptor)
  async getPageBySlug(
    @Param('slug') slug: string,
    @Query('lang') lang: string,
  ): Promise<ResponsePageDto> {
    return new ResponsePageDto(
      await this.pageService.getPageBySlug(slug),
      lang,
    );
  }
}
