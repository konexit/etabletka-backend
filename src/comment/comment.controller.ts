import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { GetByCommentIdsDto } from './dto/get-by-comment-ids.dto';
import { Comment, CommentType, ModelId } from './entities/comment.entity';
import { Product } from 'src/products/product/entities/product.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JWTPayload } from 'src/common/decorators/jwt-payload';
import { JwtPayload } from 'src/common/types/jwt/jwt.interfaces';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { GetByAnswerIdsDto } from './dto/get-by-answer-ids.dto';
import { OptionalJwtAuthGuard } from 'src/auth/jwt/optional-jwt-auth.guard';
import { CommentResponseDto } from './dto/response-comment.dto';
import { AnswerResponseDto } from './dto/response-answer.dto';
import { Answer } from './entities/comment-answer.entity';
import { Article } from 'src/ui/pages/article/entities/article.entity';

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
    const { userId } = jwtPayload;

    if (!userId) {
      throw new HttpException('Unathorized', HttpStatus.UNAUTHORIZED);
    }

    const createdComment = await this.commentService.createComment(
      userId,
      createCommentDto,
    );

    return new CommentResponseDto(createdComment);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:commentId')
  @HttpCode(204)
  async deleteComment(
    @JWTPayload() jwtPayload: JwtPayload,
    @Param('commentId', ParseIntPipe) commentId: Comment['id'],
  ) {
    const { userId } = jwtPayload;

    if (!userId) {
      throw new HttpException('Unathorized', HttpStatus.UNAUTHORIZED);
    }

    return await this.commentService.deleteComment(userId, commentId);
  }

  @Post('/ids')
  @UseGuards(OptionalJwtAuthGuard)
  async getCommentsByIds(
    @JWTPayload() jwtPayload: JwtPayload,
    @Body() getByCommentIdsDto: GetByCommentIdsDto,
  ): Promise<CommentResponseDto[]> {
    const comments = await this.commentService.getCommentsByIds(
      getByCommentIdsDto.ids,
      jwtPayload.userId
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

  @Get('/:modelType/:modelId')
  async getModelComments(
    @Param('modelType', new ParseEnumPipe(CommentType)) modelType: CommentType,
    @Param('modelId', ParseIntPipe) modelId: ModelId,
  ): Promise<Comment['id'][]> {
    return this.commentService.getCommentIdsByModelId(modelType, modelId);
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
    const { userId } = jwtPayload;

    if (!userId) {
      throw new HttpException('Unathorized', HttpStatus.UNAUTHORIZED);
    }

    const createdAnswer = await this.commentService.createAnswer(
      userId,
      commentId,
      createAnswerDto,
    );

    return new AnswerResponseDto(createdAnswer);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:commentId/answers')
  @HttpCode(204)
  async deleteAnswers(
    @JWTPayload() jwtPayload: JwtPayload,
    @Param('commentId', ParseIntPipe) commentId: Comment['id'],
  ) {
    const { userId } = jwtPayload;

    if (!userId) {
      throw new HttpException('Unathorized', HttpStatus.UNAUTHORIZED);
    }

    return await this.commentService.deleteAnswers(userId, commentId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:commentId/answer/:answerId')
  @HttpCode(204)
  async deleteAnswer(
    @JWTPayload() jwtPayload: JwtPayload,
    @Param('commentId', ParseIntPipe) commentId: Comment['id'],
    @Param('answerId', ParseIntPipe) answerId: Answer['id'],
  ) {
    const { userId } = jwtPayload;

    if (!userId) {
      throw new HttpException('Unathorized', HttpStatus.UNAUTHORIZED);
    }

    return await this.commentService.deleteAnswer(userId, commentId, answerId);
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
