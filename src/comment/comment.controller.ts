import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { GetByCommentIdsDto } from './dto/get-by-comment-ids.dto';
import { Comment } from './entities/comment.entity';

@ApiTags('comments')
@Controller('api/v1/comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post('/ids')
  async getCommentsByIds(
    @Body() getByCommentIdsDto: GetByCommentIdsDto,
  ): Promise<(Comment & { answersCount: number })[]> {
    return this.commentService.getCommentsByIds(getByCommentIdsDto.ids);
  }

  @Get('/:commentId/answers')
  async getCommentAnswers(
    @Param('commentId', ParseIntPipe) commentId: Comment['id'],
  ): Promise<(Comment & { answersCount: number })[]> {
    return this.commentService.getCommentsByParentId(commentId);
  }
}
