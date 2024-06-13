import { Controller, Get, Param } from '@nestjs/common';
import { BlogCommentService } from './blogComment.service';
import { BlogComment } from './entities/blogComment.entity';

@Controller('api/v1')
export class BlogCommentController {
  constructor(private readonly blogCommentService: BlogCommentService) {}

  @Get('/comments/post/:id')
  async getPostComments(@Param('id') id: number): Promise<BlogComment[]> {
    return await this.blogCommentService.getPostComments(id);
  }
}
