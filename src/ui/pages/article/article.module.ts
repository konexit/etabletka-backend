import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Tag } from './entities/tag.entity';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Tag])],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService, ArticleModule],
})
export class ArticleModule { }
