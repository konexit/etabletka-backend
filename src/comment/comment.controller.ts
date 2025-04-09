import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommentService } from './comment.service';

@ApiTags('comment')
@Controller('api/v1')
export class CommentController {
  constructor(private commentService: CommentService) {}
}
