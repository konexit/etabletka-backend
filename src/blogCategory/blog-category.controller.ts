import { Controller, Get } from '@nestjs/common';
import { BlogCategoryService } from './blog-category.service';
import { BlogCategory } from './entities/blog-category.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('blog-categories')
@Controller('api/v1')
export class BlogCategoryController {
  constructor(private readonly blogCategoryService: BlogCategoryService) {}

  @Get('/blog-categories')
  async getBlogCategories(): Promise<BlogCategory[]> {
    return await this.blogCategoryService.getBlogCategories();
  }
}
