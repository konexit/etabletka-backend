import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req, UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { Request } from 'express';
import { ProductCommentService } from './product-comment.service';
import { CreateProductComment } from './dto/create-product-comment.dto';
import { UpdateProductComment } from './dto/update-product-comment.dto';
import { PaginationDto } from 'src/common/dto/paginationDto';
import { AuthGuard } from "src/auth/auth.guard";

@Controller('api/v1')
export class ProductCommentController {
  constructor(private readonly productCommentService: ProductCommentService) {}

  @UseGuards(AuthGuard)
  @Post('/comment/product')
  @UseInterceptors(ClassSerializerInterceptor)
  async create(
    @Req() request: Request,
    @Body() createProductComment: CreateProductComment,
  ) {
    const token = request.headers.authorization?.split(' ')[1] ?? '';
    return await this.productCommentService.create(token, createProductComment);
  }

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
  @Delete('/comment/product/:id')
  async delete(@Req() request: Request, @Param('id') id: number) {
    const token = request.headers.authorization?.split(' ')[1] ?? '';
    try {
      return await this.productCommentService.delete(token, id);
    } catch (e) {
      console.error(e.message);
      throw e;
    }
  }

  @Get('/comments/products')
  async getComments(
    @Query() pagination?: PaginationDto,
    @Query('where') where?: any,
  ) {
    try {
      return await this.productCommentService.getComments(pagination, where);
    } catch (error) {
      console.error(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
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
