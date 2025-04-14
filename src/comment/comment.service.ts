import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async getCommentsByIds(
    commentIds: Comment['id'][],
  ): Promise<(Comment & { answersCount: number })[]> {
    if (!commentIds.length) {
      throw new HttpException('Comments not found', HttpStatus.NOT_FOUND);
    }

    const query = `
        SELECT
            c.id AS "id",
            c.model_id AS "modelId",
            c.type AS "type",
            CASE WHEN c.anonymous THEN NULL ELSE c.user_id END AS "userId",
            c.parent_id AS "parentId",
            c.rating AS "rating",
            c.comment AS "comment",
            c.approved AS "approved",
            c.created_at AS "createdAt",
            c.updated_at AS "updatedAt",
            c.deleted_at AS "deletedAt",
            (
                SELECT CAST(COUNT(*) as integer)
                FROM comments as child
                WHERE child.parent_id = c.id AND child.approved = true
            ) AS "answersCount"
        FROM comments c
        WHERE c.id IN (${commentIds.join(', ')}) AND c.approved = true
    `;

    const results: (Comment & { answersCount: number })[] =
      await this.commentRepository.query(query);

    if (!results.length) {
      throw new HttpException('Comments not found', HttpStatus.NOT_FOUND);
    }

    return results;
  }

  async getCommentIdsByParentId(
    commentId: Comment['id'],
  ) {
    const answers: Pick<Comment, 'id'>[] = await this.commentRepository.find({
      select: ['id'],
      where: { parentId: commentId },
    });

    if (!answers.length) {
      throw new HttpException('Comments not found', HttpStatus.NOT_FOUND);
    }

    return answers.map((answer) => answer.id);
  }
}
