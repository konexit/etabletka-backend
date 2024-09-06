import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { ProductCommentService } from './product-comment.service';
import { CreateProductComment } from './dto/create-product-comment.dto';
import { UpdateProductComment } from './dto/update-product-comment.dto';

@Controller('api/v1')
export class ProductCommentController {
  constructor(private readonly productCommentService: ProductCommentService) {}

  @Post('/comment/product')
  @UseInterceptors(ClassSerializerInterceptor)
  async create(
    @Req() request: Request,
    @Body() createProductComment: CreateProductComment,
  ) {
    const token = request.headers.authorization?.split(' ')[1] ?? '';
    return await this.productCommentService.create(token, createProductComment);
  }

  @Patch('/comment/product/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Req() request: Request,
    @Param('id') id: number,
    @Body() updateProductComment: UpdateProductComment,
  ) {
    const token = request.headers.authorization?.split(' ')[1] ?? '';

    if (
      updateProductComment.isApproved &&
      typeof updateProductComment.isApproved === 'string'
    ) {
      updateProductComment.isApproved =
        updateProductComment.isApproved === 'true';
    }

    try {
      return await this.productCommentService.update(
        token,
        id,
        updateProductComment,
      );
    } catch (e) {
      throw e;
    }
  }

  @Get('/comment/product/:id')
  async getProductComments(@Param('id') id: number, @Req() request: Request) {
    const token = request.headers.authorization?.split(' ')[1] ?? '';
    return await this.productCommentService.getProductComments(id, token);
  }

  @Get('/comment/:id/product')
  async getProductCommentById(@Param('id') id: number) {
    return await this.productCommentService.getProductCommentById(id);
  }
}
