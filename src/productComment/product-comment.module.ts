import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductComment } from './entities/product-comment.entity';
import { ProductCommentController } from './product-comment.controller';
import { ProductCommentService } from './product-comment.service';
import { WsGateway } from '../infrastructure/ws/ws.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([ProductComment])],
  controllers: [ProductCommentController],
  providers: [ProductCommentService, WsGateway],
  exports: [ProductCommentService, ProductCommentModule],
})
export class ProductCommentModule {}
