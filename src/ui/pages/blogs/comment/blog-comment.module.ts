import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogComment } from './entities/blog-comment.entity';
import { BlogCommentController } from './blog-comment.controller';
import { BlogCommentService } from './blog-comment.service';
import { WsGateway } from 'src/infrastructure/ws/ws.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([BlogComment])],
  controllers: [BlogCommentController],
  providers: [BlogCommentService, WsGateway],
  exports: [BlogCommentService, BlogCommentModule],
})
export class BlogCommentModule {}
