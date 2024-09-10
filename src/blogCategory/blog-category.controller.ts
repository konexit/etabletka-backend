import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req, UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { BlogCategoryService } from './blog-category.service';
import { BlogCategory } from './entities/blog-category.entity';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CreateBlogCategory } from './dto/create-blog-category.dto';
import slugify from 'slugify';
import { UpdateBlogCategory } from './dto/update-blog-category.dto';
import { AuthGuard } from "../auth/auth.guard";

@ApiTags('blog-categories')
@Controller('api/v1')
export class BlogCategoryController {
  constructor(private readonly blogCategoryService: BlogCategoryService) {}

  @UseGuards(AuthGuard)
  @Post('/blog-category/create')
  @UseInterceptors(ClassSerializerInterceptor)
  async create(
    @Req() request: Request,
    @Body() createBlogCategory: CreateBlogCategory,
  ) {
    const token = request.headers.authorization?.split(' ')[1] ?? '';
    try {
      if (
        createBlogCategory.title &&
        typeof createBlogCategory.title === 'string'
      ) {
        try {
          createBlogCategory.title = JSON.parse(createBlogCategory.title);
        } catch (error) {
          throw new HttpException(
            'Invalid JSON format in "name" property',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      if (!createBlogCategory.slug)
        createBlogCategory.slug = slugify(createBlogCategory.title['uk']);

      if (
        createBlogCategory.seoH1 &&
        typeof createBlogCategory.seoH1 === 'string'
      ) {
        try {
          createBlogCategory.seoH1 = JSON.parse(createBlogCategory.seoH1);
        } catch (error) {
          throw new HttpException(
            'Invalid JSON format in "seoH1" property',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      if (
        createBlogCategory.seoTitle &&
        typeof createBlogCategory.seoTitle === 'string'
      ) {
        try {
          createBlogCategory.seoTitle = JSON.parse(createBlogCategory.seoTitle);
        } catch (error) {
          throw new HttpException(
            'Invalid JSON format in "seoTitle" property',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      if (
        createBlogCategory.seoDescription &&
        typeof createBlogCategory.seoDescription === 'string'
      ) {
        try {
          createBlogCategory.seoDescription = JSON.parse(
            createBlogCategory.seoDescription,
          );
        } catch (error) {
          throw new HttpException(
            'Invalid JSON format in "seoTitle" property',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      return await this.blogCategoryService.create(token, createBlogCategory);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Patch('/blog-category/update/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Req() request: Request,
    @Param('id') id: number,
    @Body() updateBlogCategory: UpdateBlogCategory,
  ) {
    const token = request.headers.authorization?.split(' ')[1] ?? '';
    try {
      if (
        updateBlogCategory.title &&
        typeof updateBlogCategory.title === 'string'
      ) {
        try {
          updateBlogCategory.title = JSON.parse(updateBlogCategory.title);
        } catch (error) {
          throw new HttpException(
            'Invalid JSON format in "name" property',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      if (!updateBlogCategory.slug)
        updateBlogCategory.slug = slugify(updateBlogCategory.title['uk']);

      if (
        updateBlogCategory.seoH1 &&
        typeof updateBlogCategory.seoH1 === 'string'
      ) {
        try {
          updateBlogCategory.seoH1 = JSON.parse(updateBlogCategory.seoH1);
        } catch (error) {
          throw new HttpException(
            'Invalid JSON format in "seoH1" property',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      if (
        updateBlogCategory.seoTitle &&
        typeof updateBlogCategory.seoTitle === 'string'
      ) {
        try {
          updateBlogCategory.seoTitle = JSON.parse(updateBlogCategory.seoTitle);
        } catch (error) {
          throw new HttpException(
            'Invalid JSON format in "seoTitle" property',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      if (
        updateBlogCategory.seoDescription &&
        typeof updateBlogCategory.seoDescription === 'string'
      ) {
        try {
          updateBlogCategory.seoDescription = JSON.parse(
            updateBlogCategory.seoDescription,
          );
        } catch (error) {
          throw new HttpException(
            'Invalid JSON format in "seoTitle" property',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      return await this.blogCategoryService.update(
        token,
        +id,
        updateBlogCategory,
      );
    } catch (e) {
      throw e;
    }
  }

  @Get('/blog-categories')
  async getBlogCategories(): Promise<BlogCategory[]> {
    return await this.blogCategoryService.getBlogCategories();
  }

  @Get('/blog-category/:id')
  async getBlogCategoryById(@Param('id') id: number): Promise<BlogCategory> {
    return await this.blogCategoryService.getBlogCategoryById(+id);
  }
}
