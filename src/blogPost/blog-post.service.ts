import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogPost } from './entities/blog-post.entity';
import { In, Repository, SelectQueryBuilder } from 'typeorm';
import { BlogCategory } from '../blogCategory/entities/blog-category.entity';
import { PaginationDto } from '../common/dto/paginationDto';
import { JwtService } from '@nestjs/jwt';
import { CreatePost } from './dto/create-post.dto';
import { UpdatePost } from './dto/update-post.dto';

@Injectable()
export class BlogPostService {
  constructor(
    @InjectRepository(BlogPost)
    private readonly blogPostRepository: Repository<BlogPost>,
    @InjectRepository(BlogCategory)
    private readonly blogCategoryRepository: Repository<BlogCategory>,
    private jwtService: JwtService,
  ) {}

  private convertPost(post: BlogPost, lang: string = 'uk') {
    post.title = post.title[lang];
    if (post.excerpt) post.excerpt = post.excerpt[lang];
    if (post.content) post.content = post.content[lang];
    if (post.alt) post.alt = post.alt[lang];

    if (post.seoH1) post.seoH1 = post.seoH1[lang];
    if (post.seoTitle) post.seoTitle = post.seoTitle[lang];
    if (post.seoDescription) post.seoDescription = post.seoDescription[lang];

    if (post.categories) {
      for (const category of post.categories) {
        category.title = category.title[lang];
      }
    }
    return post;
  }

  async addBlogCategories(ids: Array<number>) {
    return await this.blogCategoryRepository.find({
      where: { id: In(ids) },
    });
  }

  async create(token: string | any[], createPost: CreatePost) {
    if (!token || typeof token !== 'string') {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const payload = await this.jwtService.decode(token);
    if (payload.roleId !== 1) {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const post = this.blogPostRepository.create(createPost);
    if (!post) {
      throw new HttpException(
        `Can't create post with data: ${createPost}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (createPost.categories) {
      const ids: Array<number> = String(createPost.categories)
        .split(',')
        .map(Number);

      post.categories = await this.addBlogCategories(ids);
    }

    const postUpd: BlogPost = await this.blogPostRepository.save(post);
    const queryBuilder = this.makeQueryBulder(postUpd.id);

    return this.convertPost(await queryBuilder.getOne());
  }

  async update(token: string | any[], id: number, updatePost: UpdatePost) {
    if (!token || typeof token !== 'string') {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const payload = await this.jwtService.decode(token);
    if (payload.roleId !== 1) {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const blogCategoryIds = updatePost.categories;
    delete updatePost.categories;

    await this.blogPostRepository.update(id, updatePost);
    const post: BlogPost = await this.blogPostRepository.findOne({
      where: { id },
      relations: ['categories'],
    });
    if (!post) {
      throw new HttpException(
        `Can't update post with data: ${updatePost}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (blogCategoryIds) {
      if (!Array.isArray(blogCategoryIds)) {
        const ids: Array<number> = String(blogCategoryIds)
          .split(',')
          .map(Number);

        console.log('GroupIds', ids);
        post.categories = await this.addBlogCategories(ids);
      } else {
        post.categories = await this.addBlogCategories(blogCategoryIds);
      }
    } else {
      post.categories = [];
    }

    const postUpd: BlogPost = await this.blogPostRepository.save(post);
    const queryBuilder = this.makeQueryBulder(postUpd.id);

    return this.convertPost(await queryBuilder.getOne());
  }

  public async fetchData(
    queryBuilder: SelectQueryBuilder<BlogPost>,
    take: number,
    skip: number,
    ids?: Array<number>,
  ) {
    const query = queryBuilder
      .select('post')
      .addSelect('author.id')
      .addSelect('author.firstName')
      .addSelect('author.lastName')
      .addSelect('censor.firstName')
      .addSelect('censor.id')
      .addSelect('censor.lastName')
      .addSelect('categories.id')
      .addSelect('categories.slug')
      .addSelect('categories.title')
      .leftJoin('post.categories', 'categories')
      .leftJoin('post.blogComments', 'blogComments')
      .leftJoin('post.author', 'author')
      .leftJoin('post.censor', 'censor');

    if (ids) query.where('post.id IN (:...ids)', { ids: ids });

    query.orderBy('post.publishedAt', 'DESC').take(take).skip(skip);

    return query.getMany();
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
    lang: string = 'uk',
  ): Promise<{ posts: BlogPost[]; pagination: any }> {
    const { take = 16, skip = 0 } = pagination;

    const queryBuilder = this.blogPostRepository.createQueryBuilder('post');
    const total = await queryBuilder.getCount();

    const posts = await this.fetchData(queryBuilder, take, skip);
    if (posts) {
      for (let post of posts) {
        post = this.convertPost(post);
      }
    }

    return {
      posts,
      pagination: { total, take, skip },
    };
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
      .addSelect('author.id')
      .addSelect('author.firstName')
      .addSelect('author.lastName')
      .addSelect('censor.id')
      .addSelect('censor.firstName')
      .addSelect('censor.lastName')
      .addSelect('categories.id')
      .addSelect('categories.slug')
      .addSelect('categories.title')
      .leftJoin('post.categories', 'categories')
      .leftJoin('post.blogComments', 'blogComments')
      .leftJoin('post.author', 'author')
      .leftJoin('post.censor', 'censor')
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
    const post = await this.blogPostRepository.findOne({
      where: { slug },
      relations: ['categories', 'author', 'censor', 'blogComments'],
    });
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    return this.convertPost(post);
  }

  async getPostById(id) {
    const queryBuilder = this.makeQueryBulder(id);
    const post = await queryBuilder.getOne();
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    return this.convertPost(post);
  }

  private makeQueryBulder(id: number) {
    const queryBuilder = this.blogPostRepository.createQueryBuilder('post');
    queryBuilder
      .select('post')
      .addSelect('author.id')
      .addSelect('author.firstName')
      .addSelect('author.lastName')
      .addSelect('censor.id')
      .addSelect('censor.firstName')
      .addSelect('censor.lastName')
      .addSelect('categories.id')
      .addSelect('categories.slug')
      .addSelect('categories.title')
      .leftJoin('post.categories', 'categories')
      .leftJoin('post.blogComments', 'blogComments')
      .leftJoin('post.author', 'author')
      .leftJoin('post.censor', 'censor')
      .where('post.id = :id', { id });

    return queryBuilder;
  }
}
