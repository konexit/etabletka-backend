import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogPost } from './entities/blog-post.entity';
import { BlogCategory } from 'src/ui/pages/blogs/category/entities/blog-category.entity';
import { BlogPostController } from './blog-post.controller';
import { BlogPostService } from './blog-post.service';

@Module({
  imports: [TypeOrmModule.forFeature([BlogPost, BlogCategory])],
  controllers: [BlogPostController],
  providers: [BlogPostService],
  exports: [BlogPostService, BlogPostModule],
})
export class BlogPostModule {}
