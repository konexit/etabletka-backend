import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query, UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ResponseCategoryDto } from './dto/response-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from "../auth/auth.guard";

@ApiTags('categories')
@Controller('api/v1')
@UseInterceptors(ClassSerializerInterceptor)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(AuthGuard)
  @Post('/categories')
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get('/categories')
  async findAll(@Query('format') format: string) {
    if (format) {
      switch (format) {
        case 'menu':
          return (await this.categoriesService.formatMenu()).map(
            (category) => new ResponseCategoryDto(category, 'uk'),
          );
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
  ) {
    if (root) {
      return await this.categoriesService.findByRoot();
    } else if (parentId) {
      return await this.categoriesService.findByParentId(parentId);
    } else if (slug) {
      return await this.categoriesService.findBySlug(slug);
    } else if (path) {
      return await this.categoriesService.findByPath(path);
    }
  }

  @Get('/categories/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async getCategoryById(@Param('id') id: number, @Query('lang') lang: string) {
    const category = await this.categoriesService.findById(id);

    if (!category) throw new NotFoundException();

    return new ResponseCategoryDto(category, lang);
  }

  @UseGuards(AuthGuard)
  @Patch('/categories/:id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @UseGuards(AuthGuard)
  @Delete('/categories/:id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
