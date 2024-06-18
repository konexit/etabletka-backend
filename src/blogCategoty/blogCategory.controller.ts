import { Controller, Get } from '@nestjs/common';
import { BlogCategoryService } from './blogCategory.service';
import { BlogCategory } from './entities/blogCategory.entity';

@Controller('api/v1')
export class BlogCategoryController {
  constructor(private readonly blogCategoryService: BlogCategoryService) {}

  @Get('/blog-categories')
  async getBlogCategories(): Promise<BlogCategory[]> {
    return await this.blogCategoryService.getBlogCategories();
  }
}
