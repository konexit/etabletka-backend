import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpException,
  HttpStatus,
  Get,
  Post,
  Param,
  UseInterceptors, Req, Query
} from "@nestjs/common";
import { BlogPostService } from './blog-post.service';
import { BlogPost } from './entities/blog-post.entity';
import { PaginationDto } from '../common/dto/paginationDto';
import { ApiTags } from '@nestjs/swagger';
import { Request } from "express";

@ApiTags('post')
@Controller('api/v1')
export class BlogPostController {
  constructor(private readonly blogPostService: BlogPostService) {}

  @Get('/blog-main')
  async getLatestPosts(): Promise<BlogPost[]> {
    return await this.blogPostService.getLatestPosts();
  }

  @Get('/blogs')
  async getPosts(
    @Req() request: Request,
    @Query('pagination') pagination?: any,
  ): Promise<{ posts: BlogPost[]; pagination: any }> {
    try {
      return await this.blogPostService.getPosts(pagination);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/blog/:category')
  async getCategoryPosts(
    @Param('category') category: string,
    @Body('pagination') pagination?: PaginationDto,
  ): Promise<{ posts: BlogPost[]; total: number }> {
    try {
      return await this.blogPostService.getCategoryPosts(category, pagination);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/blog/:category/:slug')
  async getPost(
    @Param('category') category: string,
    @Param('slug') slug: string,
  ): Promise<BlogPost> {
    return await this.blogPostService.getPost(category, slug);
  }
}
