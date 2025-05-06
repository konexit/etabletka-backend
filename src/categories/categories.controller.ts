import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { FilterCategoryDto } from './dto/filter-category.dto';
import { Categories, CategoryNav } from './categories.interface';

@ApiTags('categories')
@Controller('api/v1')
@UseInterceptors(ClassSerializerInterceptor)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @UseGuards(JwtAuthGuard)
  @Post('/categories')
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  @Get('/categories')
  async findAll(@Query('format') format?: string): Promise<Categories> {
    return this.categoriesService.findAll(format);
  }

  @Get('/categories/filter')
  @UseInterceptors(ClassSerializerInterceptor)
  async findByFilter(@Query() filterCategoryDto: FilterCategoryDto): Promise<any> {
    return this.categoriesService.findByFilter(filterCategoryDto);
  }

  @Get('/categories/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async getNavCategory(
    @Param('id', ParseIntPipe) id: number,
    @Query('depth', new ParseIntPipe({ optional: true })) depth: number,
    @Query('lang') lang: string,
  ): Promise<CategoryNav> {
    return this.categoriesService.getNavCategory(id, depth, lang);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/categories/:id')
  patchCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.patchCategory(id, updateCategoryDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/categories/:id')
  removeCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.removeCategory(id);
  }
}
