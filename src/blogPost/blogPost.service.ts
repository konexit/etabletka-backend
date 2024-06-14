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
    const queryBuilder = this.blogPostRepository.createQueryBuilder('post');

    queryBuilder
      .select('post.title')
      .addSelect('post.id')
      .addSelect('post.alt')
      .addSelect('post.publishedAt')
      .addSelect('post.cdnData')
      .addSelect('post.slug')
      .addSelect('COUNT(blogComments.id) | 0', 'commentCount')
      .addSelect('author.firstName')
      .addSelect('author.lastName')
      .addSelect('categories.id')
      .addSelect('categories.slug')
      .addSelect('categories.title')
      .leftJoin('post.categories', 'categories')
      .leftJoin('post.blogComments', 'blogComments')
      .leftJoin('post.author', 'author')
      .where('post.published = :published', { published: true })
      .groupBy('post.id')
      .addGroupBy('author.id')
      .addGroupBy('categories.id')
      .orderBy('post.publishedAt', 'DESC')
      .offset(0)
      .limit(4);

    // const sql = queryBuilder.getQuery();
    // console.log(sql);

    return await queryBuilder.getMany();
  }

  async getPost(category, slug): Promise<BlogPost> {
    const post = this.blogPostRepository.findOne({
      where: { slug },
      relations: ['categories', 'author', 'censor', 'blogComments'],
    });
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    return post;
  }
}
