import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogPost } from './entities/blog-post.entity';
import { BlogCategory } from './entities/blog-category.entity';
import { BlogComment } from './entities/blog-comment.entity';
import { BlogPostController } from './blog.controller';
import { BlogService } from './blog.service';

@Module({
  imports: [TypeOrmModule.forFeature([BlogPost, BlogCategory, BlogComment])],
  controllers: [BlogPostController],
  providers: [BlogService],
  exports: [BlogService, BlogModule],
})
export class BlogModule { }
