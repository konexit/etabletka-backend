import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { UserProfile } from 'src/user/entities/user-profile.entity';
import { Answer } from './entities/comment-answer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Answer, UserProfile])],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService, CommentModule],
})
export class CommentModule { }
