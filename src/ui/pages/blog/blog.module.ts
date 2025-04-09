import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Tag } from './entities/tag.entity';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Tag])],
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService, BlogModule],
})
export class BlogModule { }
