import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { BlogPostService } from './blogPost.service';
import { BlogPost } from './entities/blogPost.entity';

@Controller('api/v1')
export class BlogPostController {
  constructor(private readonly blogPostService: BlogPostService) {}

  @Get('/blog/main')
  async getLatestPosts(): Promise<BlogPost[]> {
    return await this.blogPostService.getLatestPosts();
  }


  @Get('/blog')
  async getPosts(): Promise<BlogPost[]> {
    return await this.blogPostService.getPosts();
  }

  @Get('/blog/:category')
  async getCategoryPosts(@Param('category') category: string): Promise<BlogPost[]> {
    return await this.blogPostService.getCategoryPosts(category);
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
