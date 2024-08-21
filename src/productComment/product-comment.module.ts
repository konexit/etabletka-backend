import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductComment } from './entities/product-comment.entity';
import { ProductCommentController } from './product-comment.controller';
import { ProductCommentService } from './product-comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductComment])],
  controllers: [ProductCommentController],
  providers: [ProductCommentService],
  exports: [ProductCommentService, ProductCommentModule],
})
export class ProductCommentModule {}
