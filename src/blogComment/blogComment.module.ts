import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogComment } from './entities/blogComment.entity';
import { BlogCommentController } from './blogComment.controller';
import { BlogCommentService } from './blogComment.service';

@Module({
  imports: [TypeOrmModule.forFeature([BlogComment])],
  controllers: [BlogCommentController],
  providers: [BlogCommentService],
  exports: [BlogCommentService, BlogCommentModule],
})
export class BlogCommentModule {}
