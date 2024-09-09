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
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { BlogCommentService } from './blog-comment.service';
import { BlogComment } from './entities/blog-comment.entity';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CreatePostComment } from './dto/create-post-comment.dto';
import { UpdatePostComment } from './dto/update-post-comment.dto';
import { PaginationDto } from '../common/dto/paginationDto';

@ApiTags('comments/post')
@Controller('api/v1')
export class BlogCommentController {
  constructor(private readonly blogCommentService: BlogCommentService) {}

  @Post('/comment/post')
  @UseInterceptors(ClassSerializerInterceptor)
  async create(
    @Req() request: Request,
    @Body() createPostComment: CreatePostComment,
  ) {
    const token = request.headers.authorization?.split(' ')[1] ?? '';
    return await this.blogCommentService.create(token, createPostComment);
  }

  @Patch('/comment/post/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Req() request: Request,
    @Param('id') id: number,
    @Body() updatePostComment: UpdatePostComment,
  ) {
    const token = request.headers.authorization?.split(' ')[1] ?? '';

    if (
      updatePostComment.isApproved &&
      typeof updatePostComment.isApproved === 'string'
    ) {
      updatePostComment.isApproved = updatePostComment.isApproved === 'true';
    }

    try {
      return await this.blogCommentService.update(
        token,
        +id,
        updatePostComment,
      );
    } catch (e) {
      console.error(e.message);
      throw e;
    }
  }

  @Delete('/comment/post/:id')
  async delete(@Req() request: Request, @Param('id') id: number) {
    const token = request.headers.authorization?.split(' ')[1] ?? '';
    try {
      return await this.blogCommentService.delete(token, id);
    } catch (e) {
      console.error(e.message);
      throw e;
    }
  }

  @Get('/comments/posts')
  async getComments(
    @Query() pagination?: PaginationDto,
    @Query('where') where?: any,
  ) {
    try {
      return await this.blogCommentService.getComments(pagination, where);
    } catch (error) {
      console.error(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/comments/post/:id')
  async getPostComments(
    @Param('id') id: number,
    @Req() request: Request,
  ): Promise<BlogComment[]> {
    const token = request.headers.authorization?.split(' ')[1] ?? '';
    return await this.blogCommentService.getPostComments(id, token);
  }

  @Get('/comment/:id/post')
  async getPostCommentById(@Param('id') id: number): Promise<BlogComment> {
    return await this.blogCommentService.getPostCommentById(id);
  }
}
