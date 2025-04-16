import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { GetByCommentIdsDto } from './dto/get-by-comment-ids.dto';
import { Comment } from './entities/comment.entity';
import { Product } from 'src/products/product/entities/product.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JWTPayload } from 'src/common/decorators/jwt-payload';
import { JwtPayload } from 'src/common/types/jwt/jwt.interfaces';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { Answer } from './entities/answer.entity';
import { GetByAnswerIdsDto } from './dto/get-by-answer-ids.dto';
import { OptionalJwtAuthGuard } from 'src/auth/jwt/optional-jwt-auth.guard';
import { CommentResponseDto } from './dto/response-comment.dto';
import { AnswerResponseDto } from './dto/response-answer.dto';

@ApiTags('comments')
@Controller('api/v1/comment')
@UseInterceptors(ClassSerializerInterceptor)
export class CommentController {
  constructor(private commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async createComment(
    @JWTPayload() jwtPayload: JwtPayload,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    const createdComment = await this.commentService.createComment(
      jwtPayload,
      createCommentDto,
    );
    return new CommentResponseDto(createdComment);
  }

  @Post('/ids')
  @UseGuards(OptionalJwtAuthGuard)
  async getCommentsByIds(
    @JWTPayload() jwtPayload: JwtPayload,
    @Body() getByCommentIdsDto: GetByCommentIdsDto,
  ): Promise<CommentResponseDto[]> {
    const comments = await this.commentService.getCommentsByIds(
      getByCommentIdsDto.ids,
    );

    if (!comments.length) {
      throw new HttpException('Comments not found', HttpStatus.NOT_FOUND);
    }

    const result: CommentResponseDto[] = [];

    for (const comment of comments) {
      result.push(new CommentResponseDto(comment, jwtPayload?.userId));
    }

    return result;
  }

  @Get('/product/:productId')
  async getProductComments(
    @Param('productId', ParseIntPipe) productId: Product['id'],
  ): Promise<Comment['id'][]> {
    return this.commentService.getCommentIdsByProductId(productId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:commentId/like')
  async likeComment(
    @JWTPayload() jwtPayload: JwtPayload,
    @Param('commentId', ParseIntPipe) commentId: number,
  ): Promise<CommentResponseDto> {
    const updatedComment = await this.commentService.likeComment(
      jwtPayload,
      commentId,
    );
    return new CommentResponseDto(updatedComment, jwtPayload?.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:commentId/dislike')
  async dislikeComment(
    @JWTPayload() jwtPayload: JwtPayload,
    @Param('commentId', ParseIntPipe) commentId: number,
  ): Promise<CommentResponseDto> {
    const updatedComment = await this.commentService.dislikeComment(
      jwtPayload,
      commentId,
    );
    return new CommentResponseDto(updatedComment, jwtPayload?.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:commentId/answer')
  async createAnswer(
    @JWTPayload() jwtPayload: JwtPayload,
    @Param('commentId', ParseIntPipe) commentId: Comment['id'],
    @Body() createAnswerDto: CreateAnswerDto,
  ): Promise<AnswerResponseDto> {
    const createdAnswer = await this.commentService.createAnswer(
      jwtPayload,
      commentId,
      createAnswerDto,
    );

    return new AnswerResponseDto(createdAnswer);
  }

  @Post('/answer/ids')
  async getAnswersByIds(
    @Body() getByAnswerIdsDto: GetByAnswerIdsDto,
  ): Promise<AnswerResponseDto[]> {
    const answers = await this.commentService.getAnswersByIds(
      getByAnswerIdsDto.ids,
    );

    const result: AnswerResponseDto[] = [];

    for (const answer of answers) {
      result.push(new AnswerResponseDto(answer));
    }

    return result;
  }
}
