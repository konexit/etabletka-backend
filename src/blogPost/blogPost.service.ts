import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogPost } from './entities/blogPost.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { BlogCategory } from '../blogCategoty/entities/blogCategory.entity';
import { PaginationDto } from '../common/dto/paginationDto';

@Injectable()
export class BlogPostService {
  constructor(
    @InjectRepository(BlogPost)
    private readonly blogPostRepository: Repository<BlogPost>,
    @InjectRepository(BlogCategory)
    private readonly blogCategoryRepository: Repository<BlogCategory>,
  ) {}

  public async fetchData(
    queryBuilder: SelectQueryBuilder<BlogPost>,
    take: number,
    skip: number,
    ids?: Array<number>,
  ) {
    const query = queryBuilder
      .select('post')
      .addSelect('author.firstName')
      .addSelect('author.lastName')
      .addSelect('categories.id')
      .addSelect('categories.slug')
      .addSelect('categories.title')
      .leftJoin('post.categories', 'categories')
      .leftJoin('post.blogComments', 'blogComments')
      .leftJoin('post.author', 'author');

    if (ids) query.where('post.id IN (:...ids)', { ids: ids });

    query.orderBy('post.publishedAt', 'DESC').take(take).skip(skip);

    return query.getMany();
  }

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

  async getPosts(
    pagination: PaginationDto = {},
  ): Promise<{ posts: BlogPost[]; total: number }> {
    const { take = 16, skip = 0 } = pagination;

    const queryBuilder = this.blogPostRepository.createQueryBuilder('post');
    const total = await queryBuilder.getCount();

    const posts = await this.fetchData(queryBuilder, take, skip);

    return { posts, total };
  }

  async getCategoryPosts(
    slug,
    pagination,
  ): Promise<{ posts: BlogPost[]; total: number }> {
    const { take = 16, skip = 0 } = pagination;

    const category = await this.blogCategoryRepository.findOne({
      where: { slug },
      relations: ['posts'],
    });

    if (!category) {
      throw new HttpException(
        'Posts categories not found',
        HttpStatus.NOT_FOUND,
      );
    }

    const postIds = category?.posts.map((p: BlogPost) => p.id);
    const queryBuilder: SelectQueryBuilder<BlogPost> =
      this.blogPostRepository.createQueryBuilder('post');
    const total = await queryBuilder
      .where('post.id IN (:...ids)', { ids: postIds })
      .getCount();

    const posts = await this.fetchData(queryBuilder, take, skip, postIds);

    return { posts, total };
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
      .limit(3);

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
