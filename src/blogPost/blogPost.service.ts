import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogPost } from './entities/blogPost.entity';
import { Repository } from 'typeorm';
import { BlogCategory } from '../blogCategoty/entities/blogCategory.entity';

@Injectable()
export class BlogPostService {
  constructor(
    @InjectRepository(BlogPost)
    private readonly blogPostRepository: Repository<BlogPost>,
    @InjectRepository(BlogCategory)
    private readonly blogCategoryRepository: Repository<BlogCategory>,
  ) {}

  async create(): Promise<BlogPost> {
    return await this.blogPostRepository.create();
  }

  async addCategoryToPost(id: number, blogCategoryId: number): Promise<void> {
    const post = await this.blogPostRepository.findOne({
      where: { id },
      relations: ['categories'],
    });

    const category = await this.blogCategoryRepository.findOneBy({
      id: blogCategoryId,
    });
    post.categories.push(category);
    await this.blogPostRepository.save(post);
  }

  async getPosts(): Promise<BlogPost[]> {
    const posts = await this.blogPostRepository.find();
    if (!posts) {
      throw new HttpException(
        'Posts categories not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return posts;
  }

  async getLatestPosts(): Promise<BlogPost[]> {
    const queryBuilder = this.blogPostRepository.createQueryBuilder('blogPost');

    queryBuilder
      .select('blogPost.title', 'title')
      .addSelect('COUNT(comment.id)', 'commentCount')
      .addSelect('blogPost.publishedAt', 'publishedAt')
      .addSelect('COUNT(comment.id)', 'commentCount')
      .addSelect('user.firstName', 'firstName')
      .addSelect('user.lastName', 'lastName')
      .leftJoinAndSelect('blogPost.comments', 'comment')
      .leftJoinAndSelect('blogPost.user', 'user')
      .groupBy('blogPost.id')
      .orderBy('blogPost.publishedAt', 'DESC')
      .limit(3);

    return await queryBuilder.getMany();
  }
}
