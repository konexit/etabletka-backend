import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpException,
  HttpStatus,
  Get,
  Post,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { BlogPostService } from './blogPost.service';
import { BlogPost } from './entities/blogPost.entity';
import { PaginationDto } from '../common/dto/paginationDto';

@Controller('api/v1')
export class BlogPostController {
  constructor(private readonly blogPostService: BlogPostService) {}

  @Get('/blog-main')
  async getLatestPosts(): Promise<BlogPost[]> {
    return await this.blogPostService.getLatestPosts();
  }

  @Post('/blog')
  async getPosts(
    @Body('pagination') pagination?: PaginationDto,
  ): Promise<{ posts: BlogPost[]; total: number }> {
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
