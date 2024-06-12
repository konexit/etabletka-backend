import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogCategory } from './entities/blogCategory.entity';
import { BlogCategoryController } from './blogCategory.controller';
import { BlogCategoryService } from './blogCategory.service';
import { BlogPost } from '../blogPost/entities/blogPost.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlogCategory, BlogPost])],
  controllers: [BlogCategoryController],
  providers: [BlogCategoryService],
  exports: [BlogCategoryService, BlogCategoryModule],
})
export class BlogCategoryModule {}
