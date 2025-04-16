import { Exclude, Expose } from 'class-transformer';
import { Comment, CommentType } from '../entities/comment.entity';
import { User } from 'src/user/entities/user.entity';

@Exclude()
export class CommentResponseDto {
  @Expose()
  id: number;

  @Expose()
  modelId: number;

  @Expose()
  type: CommentType;

  @Expose()
  userId: number | null;

  @Expose()
  rating: number;

  @Expose()
  comment: string;

  @Expose()
  likes: number;

  @Expose()
  dislikes: number;

  @Expose()
  answers: number;

  @Expose()
  userAction: 'like' | 'dislike' | null;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(comment: Comment, userId: User['id'] | null = null) {
    Object.assign(this, comment);

    this.userId = comment.anonymous ? null : comment.userId;
    this.likes = comment.likes.length;
    this.dislikes = comment.dislikes.length;
    this.userAction = this.getUserAction(comment, userId);
  }

  private getUserAction(
    comment: Comment,
    userId: User['id'] | null,
  ): 'like' | 'dislike' | null {
    if (!userId) return null;
    if (comment.likes.includes(userId)) return 'like';
    if (comment.dislikes.includes(userId)) return 'dislike';
    return null;
  }
}
