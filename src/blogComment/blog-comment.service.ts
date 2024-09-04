import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogComment } from './entities/blog-comment.entity';
import { Repository } from 'typeorm';
import { CreatePostComment } from './dto/create-post-comment.dto';
import { UpdatePostComment } from './dto/update-post-comment.dto';
import { JwtService } from '@nestjs/jwt';
import { WsGateway } from '../ws/ws.gateway';

@Injectable()
export class BlogCommentService {
  constructor(
    @InjectRepository(BlogComment)
    private readonly blogCommentRepository: Repository<BlogComment>,
    private readonly wsGateway: WsGateway,
    private jwtService: JwtService,
  ) {}

  async create(token: string, createPostComment: CreatePostComment) {
    if (!token || typeof token !== 'string') {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }
    const comment = this.blogCommentRepository.create(createPostComment);
    if (!comment) {
      throw new HttpException(
        `Can't create comment to post with data: ${createPostComment}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const result: BlogComment = await this.blogCommentRepository.save(comment);
    this.wsGateway.handleEmit({ event: 'new_post_comment', data: result });
    return result;
  }

  async update(
    token: string,
    id: number,
    updatePostComment: UpdatePostComment,
  ) {
    if (!token || typeof token !== 'string') {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    // TODO: only admin can approve comments
    const payload = await this.jwtService.decode(token);
    if (payload?.roleId !== 1) {
      updatePostComment.isApproved = false;
    }

    await this.blogCommentRepository.update(id, updatePostComment);

    const comment = await this.blogCommentRepository.findOneBy({
      id,
    });
    if (!comment) {
      throw new HttpException(
        `Can't update comment for post with data: ${updatePostComment}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!comment.isApproved) {
      this.wsGateway.handleEmit({
        event: 'update_post_comment',
        data: comment,
      });
    }

    return comment;
  }

  async getPostComments(postId: number, token: string): Promise<BlogComment[]> {
    if (token || typeof token === 'string') {
      const payload = await this.jwtService.decode(token);
      // TODO: get all for Admin
      if (payload.roleId === 1) {
        return await this.blogCommentRepository.find({
          where: { postId },
          relations: ['author', 'blogPost'],
        });
      }
    }

    const comments = await this.blogCommentRepository.find({
      where: { postId, isApproved: true },
      relations: ['author', 'blogPost'],
    });

    if (!comments) {
      throw new HttpException(
        'Comments for post not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return comments;
  }

  async getPostCommentById(id: number) {
    const comment = await this.blogCommentRepository.findOne({
      where: { id },
      relations: ['author', 'blogPost'],
    });

    if (!comment) {
      throw new HttpException(
        'Comment for post not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return comment;
  }
}
