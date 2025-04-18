import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
import { Comment, CommentType } from './entities/comment.entity';
import { Product } from 'src/products/product/entities/product.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UserProfile } from 'src/user/entities/user-profile.entity';
import { JwtPayload } from 'src/common/types/jwt/jwt.interfaces';
import { Answer } from './entities/comment-answer.entity';
import { CreateAnswerDto } from './dto/create-answer.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
  ) {}

  async createComment(
    jwtPayload: JwtPayload,
    createCommentDto: CreateCommentDto,
  ) {
    const { userId } = jwtPayload;

    if (!userId) {
      throw new HttpException('Unathorized', HttpStatus.UNAUTHORIZED);
    }

    // !!! TODO: Temporary logic !!!
    // In the future add comment entity only
    // User profile update will be triggered when admin sets approved to true or false
    return await this.commentRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        const comment = entityManager.create(Comment, {
          ...createCommentDto,
          userId,
        });

        await entityManager.save(Comment, comment);

        const userProfile = await entityManager.findOne(UserProfile, {
          where: { userId },
        });

        if (!userProfile) {
          throw new Error('User profile not found');
        }

        userProfile.comments = [...userProfile.comments, comment.id];

        await entityManager.save(UserProfile, userProfile);

        return comment;
      },
    );
  }

  async createAnswer(
    jwtPayload: JwtPayload,
    commentId: Comment['id'],
    createAnswerDto: CreateAnswerDto,
  ) {
    const { userId } = jwtPayload;

    if (!userId) {
      throw new HttpException('Unathorized', HttpStatus.UNAUTHORIZED);
    }

    // !!! TODO: Temporary logic !!!
    // In the future add answer entity only
    // Comment answers array update will be triggered when admin sets approved to true or false
    // User profile update will be triggered when admin sets approved to true or false
    return await this.commentRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        const answer = entityManager.create(Answer, {
          ...createAnswerDto,
          commentId,
          userId,
        });

        await entityManager.save(Answer, answer);

        const userProfile = await entityManager.findOne(UserProfile, {
          where: { userId },
        });

        if (!userProfile) {
          throw new Error('User profile not found');
        }

        userProfile.answers = [...userProfile.answers, answer.id];

        await entityManager.save(UserProfile, userProfile);

        const comment = await entityManager.findOne(Comment, {
          where: { id: commentId },
        });

        if (!comment) {
          throw new Error('Comment not found');
        }

        comment.answers = [...comment.answers, answer.id];
        await entityManager.save(Comment, comment);

        return answer;
      },
    );
  }

  async getCommentsByIds(commentIds: Comment['id'][]) {
    if (!commentIds.length) {
      throw new HttpException('Comments not found', HttpStatus.NOT_FOUND);
    }

    return await this.commentRepository.find({
      where: {
        id: In(commentIds),
        approved: true,
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async getAnswersByIds(answerIds: Answer['id'][]) {
    return await this.answerRepository.find({
      where: {
        id: In(answerIds),
        approved: true,
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async getCommentIdsByProductId(productId: Product['id']) {
    const comments: Pick<Comment, 'id'>[] = await this.commentRepository.find({
      select: ['id'],
      where: { type: CommentType.PRODUCT, modelId: productId, approved: true },
      order: {
        id: 'DESC',
      },
    });

    if (!comments.length) {
      throw new HttpException('Comments not found', HttpStatus.NOT_FOUND);
    }

    return comments.map((comment) => comment.id);
  }

  async likeComment(jwtPayload: JwtPayload, commentId: Comment['id']) {
    const { userId } = jwtPayload;

    if (!userId) {
      throw new HttpException('Unathorized', HttpStatus.UNAUTHORIZED);
    }

    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }

    if (userId === comment.userId) {
      throw new HttpException(
        'User cannot react to his own comment',
        HttpStatus.FORBIDDEN,
      );
    }

    if (comment.likes.includes(userId)) {
      comment.likes = comment.likes.filter((id) => id !== userId);
    } else {
      comment.likes = [...comment.likes, userId];
      comment.dislikes = comment.dislikes.filter((id) => id !== userId);
    }

    return await this.commentRepository.save(comment);
  }

  async dislikeComment(jwtPayload: JwtPayload, commentId: Comment['id']) {
    const { userId } = jwtPayload;

    if (!userId) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }

    if (userId === comment.userId) {
      throw new HttpException(
        'User cannot react to his own comment',
        HttpStatus.FORBIDDEN,
      );
    }

    if (comment.dislikes.includes(userId)) {
      comment.dislikes = comment.dislikes.filter((id) => id !== userId);
    } else {
      comment.dislikes = [...comment.dislikes, userId];
      comment.likes = comment.likes.filter((id) => id !== userId);
    }

    return await this.commentRepository.save(comment);
  }
}
