import { Controller } from '@nestjs/common';
import { BlogPostService } from './blogPost.service';
import { BlogPost } from './entities/blogPost.entity';

@Controller('api/v1')
export class BlogPostController {
  constructor(private readonly blogPostService: BlogPostService) {}

  async getPosts(): Promise<BlogPost[]> {
    return await this.blogPostService.getPosts();
  }

  async getLatestPosts(): Promise<BlogPost[]> {
    return await this.blogPostService.getLatestPosts();
  }
}
