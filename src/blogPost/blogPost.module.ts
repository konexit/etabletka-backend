import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogPost } from './entities/blogPost.entity';
import { BlogCategory } from '../blogCategoty/entities/blogCategory.entity';
import { BlogPostController } from './blogPost.controller';
import { BlogPostService } from './blogPost.service';

@Module({
  imports: [TypeOrmModule.forFeature([BlogPost, BlogCategory])],
  controllers: [BlogPostController],
  providers: [BlogPostService],
  exports: [BlogPostService, BlogPostModule],
})
export class BlogPostModule {}
