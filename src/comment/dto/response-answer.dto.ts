import { Exclude, Expose } from 'class-transformer';
import { Comment } from '../entities/comment.entity';
import { User } from 'src/user/entities/user.entity';
import { Answer } from '../entities/answer.entity';

@Exclude()
export class AnswerResponseDto {
  @Expose()
  id: Answer['id'];

  @Expose()
  commentId: Comment['id'];

  @Expose()
  userId: User['id'] | null;

  @Expose()
  answer: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(answer: Answer) {
    Object.assign(this, answer);
  }
}
