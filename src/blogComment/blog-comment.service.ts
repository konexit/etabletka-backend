import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogComment } from './entities/blog-comment.entity';
import { Repository } from 'typeorm';
import { CreatePostComment } from './dto/create-post-comment.dto';
import { UpdatePostComment } from './dto/update-post-comment.dto';

@Injectable()
export class BlogCommentService {
  constructor(
    @InjectRepository(BlogComment)
    private readonly blogCommentRepository: Repository<BlogComment>,
  ) {}

  async create(token: string | any[], createPostComment: CreatePostComment) {
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
    token: string | any[],
    id: number,
    updatePostComment: UpdatePostComment,
  ) {
    if (!token || typeof token !== 'string') {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
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

  async getPostComments(postId: number): Promise<BlogComment[]> {
    const comments = await this.blogCommentRepository.find({
      where: { postId, isApproved: true },
    });

    if (!comments) {
      throw new HttpException(
        'Blog categories not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return comments;
  }
}
