import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

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
      }
    }
    return await this.categoriesService.findAll();
  }

  @Get('/categories/filter')
  async findByFilter(
    @Query('root') root: boolean,
    @Query('parent_id') parentId: number,
    @Query('id') id: number,
    @Query('slug') slug: string,
    @Query('path') path: string,
  ) {
    if (root) return await this.categoriesService.findByRoot();
    if (id) return await this.categoriesService.findById(id);
    if (parentId) return await this.categoriesService.findByParentId(parentId);
    if (slug) return await this.categoriesService.findBySlug(slug);
    if (path) return await this.categoriesService.findByPath(path);
    return [];
  }

  @Get('/category/:id/products')
  async getProductsByCategoryId(@Param('id') id: number): Promise<any> {
    return await this.categoriesService.getProductsByCategoryId(+id);
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
