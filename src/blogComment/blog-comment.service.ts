import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogComment } from './entities/blog-comment.entity';
import { Repository } from 'typeorm';
import { CreatePostComment } from './dto/create-post-comment.dto';
import { UpdatePostComment } from './dto/update-post-comment.dto';
import { JwtService } from '@nestjs/jwt';
import { WsGateway } from '../infrastructure/ws/ws.gateway';
import { PaginationDto } from '../common/dto/paginationDto';

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

    if (!comment.isApproved && payload?.roleId !== 1) {
      this.wsGateway.handleEmit({
        event: 'update_post_comment',
        data: comment,
      });
    }

    return await this.blogCommentRepository.save(comment);
  }

  async delete(token: string, id: number) {
    if (!token || typeof token !== 'string') {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const payload = await this.jwtService.decode(token);
    if (payload?.roleId !== 1) {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const comment = await this.blogCommentRepository.findOneBy({
      id: id,
    });
    if (!comment) {
      throw new HttpException(
        'Can`t delete blog comment',
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.blogCommentRepository.delete(id);
  }

  async getComments(
    pagination: PaginationDto = {},
    where: any = {},
    lang: string = 'uk',
  ) {
    const { take = 15, skip = 0 } = pagination;

    const queryBuilder =
      this.blogCommentRepository.createQueryBuilder('blogComment');
    const total = await queryBuilder.getCount();

    queryBuilder
      .select('blogComment')
      // .addSelect(`(blog_posts.title->'${lang}')::varchar`, 'postTitle')
      .addSelect('blogPost.title')
      .addSelect('author.id')
      .addSelect('author.firstName')
      .addSelect('author.lastName')
      .leftJoin('blogComment.author', 'author')
      .leftJoin('blogComment.blogPost', 'blogPost')
      .orderBy('blogComment.createdAt', 'DESC')
      .take(take)
      .skip(skip)
      .where('blogComment.id is not null');

    /** Where statements **/
    if (where) {
      if (where?.approved) {
        queryBuilder.andWhere('blogComment.isApproved = :isApproved', {
          isApproved: where.approved,
        });
      }
    }

    //console.log('SQL', queryBuilder.getQuery());

    const comments = await queryBuilder.getMany();
    if (comments) {
      for (const comment of comments) {
        comment.blogPost.title = comment.blogPost.title[lang];
      }
    }

    return {
      comments,
      pagination: { total, take, skip },
    };
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
