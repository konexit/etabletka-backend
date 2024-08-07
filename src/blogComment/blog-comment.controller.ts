import { Controller, Get, Param } from '@nestjs/common';
import { BlogCommentService } from './blog-comment.service';
import { BlogComment } from './entities/blog-comment.entity';
import { ApiTags } from "@nestjs/swagger";

@ApiTags('comments/post')
@Controller('api/v1')
export class BlogCommentController {
  constructor(private readonly blogCommentService: BlogCommentService) {}

  @Get('/comments/post/:id')
  async getPostComments(@Param('id') id: number): Promise<BlogComment[]> {
    return await this.blogCommentService.getPostComments(id);
  }
}
