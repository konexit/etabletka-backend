import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ResponseCategoryDto } from './dto/response-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('categories')
@Controller('api/v1')
@UseInterceptors(ClassSerializerInterceptor)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('/categories')
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get('/categories')
  async findAll(@Query('format') format: string) {
    if (format) {
      switch (format) {
        case 'menu':
          return await this.categoriesService.formatMenu();
        case 'menu-root':
          return (await this.categoriesService.formatMenuRoot()).map(
            (category) => new ResponseCategoryDto(category, 'uk'),
          );
      }
    }
    return await this.categoriesService.findAll();
  }

  @Get('/categories/filter')
  @UseInterceptors(ClassSerializerInterceptor)
  async findByFilter(
    @Query('root') root: boolean,
    @Query('parent_id') parentId: number,
    @Query('id') id: number,
    @Query('slug') slug: string,
    @Query('path') path: string,
    @Query('lang') lang: string = 'uk',
  ) {
    if (root) {
      return await this.categoriesService.findByRoot();
    } else if (id) {
      return new ResponseCategoryDto(
        await this.categoriesService.findById(id),
        lang,
      );
    } else if (parentId) {
      return await this.categoriesService.findByParentId(parentId);
    } else if (slug) {
      return await this.categoriesService.findBySlug(slug);
    } else if (path) {
      return await this.categoriesService.findByPath(path);
    }
  }

  @Patch('/categories/:id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete('/categories/:id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
