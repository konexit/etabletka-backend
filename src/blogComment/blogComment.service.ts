import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogComment } from './entities/blogComment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BlogCommentService {
  constructor(
    @InjectRepository(BlogComment)
    private readonly blogCommentRepository: Repository<BlogComment>,
  ) {}

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
