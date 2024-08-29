import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogComment } from './entities/blog-comment.entity';
import { Repository } from 'typeorm';
import { CreatePostComment } from './dto/create-post-comment.dto';
import { UpdatePostComment } from './dto/update-post-comment.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class BlogCommentService {
  constructor(
    @InjectRepository(BlogComment)
    private readonly blogCommentRepository: Repository<BlogComment>,
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
    return await this.blogCommentRepository.save(comment);
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
    return comment;
  }

  async getPostComments(postId: number, token: string): Promise<BlogComment[]> {
    if (token || typeof token === 'string') {
      const payload = await this.jwtService.decode(token);
      // TODO: get all for Admin
      if (payload.roleId === 1) {
        return await this.blogCommentRepository.find({
          where: { postId },
          relations: ['author', 'product'],
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
