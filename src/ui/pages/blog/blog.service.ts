import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, SelectQueryBuilder } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { BlogPost } from './entities/blog-post.entity';
import { BlogCategory } from './entities/blog-category.entity';
import { BlogComment } from './entities/blog-comment.entity';
import { CreatePost } from './dto/create-post.dto';
import { UpdatePost } from './dto/update-post.dto';

@Injectable()
export class BlogService {
  private cacheBlogCategoriesKey: string = 'blogCategories';
  private cacheBlogCategoriesTTL: number = 3600_000; // 1 Hour

  constructor(
    @InjectRepository(BlogPost)
    private blogPostRepository: Repository<BlogPost>,
    @InjectRepository(BlogCategory)
    private blogCategoryRepository: Repository<BlogCategory>,
    @InjectRepository(BlogCategory)
    private blogCommentRepository: Repository<BlogComment>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache
  ) { }

  async addBlogCategories(ids: Array<number>) {
    return this.blogCategoryRepository.find({
      where: { id: In(ids) },
    });
  }

  async getBlogCategories(lang: string = 'uk'): Promise<any> {
    const cacheCategories = await this.cacheManager.get(
      this.cacheBlogCategoriesKey,
    );
    if (cacheCategories) {
      return cacheCategories;
    }

    const blogCategories = await this.blogCategoryRepository.find({
      order: { id: 'ASC' },
    });
    if (!blogCategories) {
      throw new HttpException(
        'Blog categories not found',
        HttpStatus.NOT_FOUND,
      );
    }

    for (let blogCategory of blogCategories) {
      blogCategory = this.convertRecord(blogCategory, lang);
    }

    await this.cacheManager.set(
      this.cacheBlogCategoriesKey,
      blogCategories,
      this.cacheBlogCategoriesTTL,
    );

    return blogCategories;
  }

  async create(createPost: CreatePost) {
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

  async update(id: number, updatePost: UpdatePost) {
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

  async delete(id: number) {
    const post = await this.blogPostRepository.findOneBy({
      id: id,
    });
    if (!post) {
      throw new HttpException('Can`t delete post', HttpStatus.NOT_FOUND);
    }

    return this.blogPostRepository.delete(id);
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
  ): Promise<{ posts: BlogPost[]; total: number }> {
    const { take = 15, skip = 0 } = pagination;

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
      total,
    };
  }

  async getCategoryPosts(
    slug: string,
    pagination: PaginationDto = {},
  ): Promise<{ posts: BlogPost[]; total: number }> {
    const { take = 15, skip = 0 } = pagination;

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

    const postIds = category?.posts.map((p: BlogPost) => p.id) || [];

    if (postIds.length === 0) {
      return { posts: [], total: 0 };
    }

    const queryBuilder: SelectQueryBuilder<BlogPost> =
      this.blogPostRepository.createQueryBuilder('post');
    const total = await queryBuilder
      .where('post.id IN (:...ids)', { ids: postIds })
      .getCount();

    const posts = await this.fetchData(queryBuilder, take, skip, postIds);

    if (posts) {
      for (const post of posts) {
        Object.assign(post, this.convertPost(post));
      }
    }

    return { posts, total };
  }

  async getLatestPosts(): Promise<BlogPost[]> {
    const articles = await this.blogPostRepository.query(`
      WITH CommentCounts AS (
          SELECT
              "post"."id" AS "post_id",
              COUNT("blogComments"."id") AS "commentCount"
          FROM
              "blog_posts" "post"
          LEFT JOIN 
              "blog_comments" "blogComments" 
              ON "blogComments"."post_id" = "post"."id"
          WHERE
              "post"."published" = true
          GROUP BY
              "post"."id"
      ),
      CategoryData AS (
          SELECT 
              "post_categories"."blogPostsId" AS "post_id",
              JSON_AGG(
                  JSON_BUILD_OBJECT(
                      'id', "categories"."id",
                      'title', "categories"."title",
                      'slug', "categories"."slug"
                  )
              ) AS "categories"
          FROM 
              "cross_blog_categories_posts" "post_categories"
          JOIN 
              "blog_categories" "categories" 
              ON "categories"."id" = "post_categories"."blogCategoriesId"
          GROUP BY 
              "post_categories"."blogPostsId"
      ),
      CommentData AS (
          SELECT
              "blogComments"."post_id" AS "post_id",
              JSON_AGG(
                  JSON_BUILD_OBJECT(
                      'id', "blogComments"."id",
                      'authorId', "blogComments"."user_id",
                      'content', "blogComments"."comment",
                      'createdAt', "blogComments"."created_at",
                      'updatedAt', "blogComments"."updated_at"
                  )
              ) AS "comments"
          FROM
              "blog_comments" "blogComments"
          GROUP BY
              "blogComments"."post_id"
      )
      SELECT 
          "post"."id" AS "id", 
          "post"."author_id" AS "authorId",
          "post"."censor_id" AS "censorId",
          "post"."published_at" AS "publishedAt", 
          "post"."title" AS "title", 
          "post"."slug" AS "slug", 
          "post"."excerpt" AS "excerpt",
          "post"."content" AS "content",
          "post"."alt" AS "alt", 
          "post"."cdn_data" AS "cdnData",
          COALESCE(CategoryData."categories", '[]') AS "categories",
          "author"."id" AS "authorId", 
          JSON_BUILD_OBJECT(
              'id', "author"."id",
              'firstName', "author"."first_name",
              'lastName', "author"."last_name"
          ) AS "author",
          "censor"."id" AS "censorId", 
          JSON_BUILD_OBJECT(
              'id', "censor"."id",
              'firstName', "censor"."first_name",
              'lastName', "censor"."last_name"
          ) AS "censor",
          COALESCE(CommentData."comments", '[]') AS "blogComments",
          "post"."seo_h1" AS "seoH1",
          "post"."seo_title" AS "seoTitle",
          "post"."seo_description" AS "seoDescription"
      FROM 
          "blog_posts" "post"
      LEFT JOIN 
          CategoryData 
          ON CategoryData."post_id" = "post"."id"
      LEFT JOIN 
          "users" "author" 
          ON "author"."id" = "post"."author_id"  
      LEFT JOIN 
          "users" "censor" 
          ON "censor"."id" = "post"."censor_id"
      LEFT JOIN
          CommentData 
          ON CommentData."post_id" = "post"."id"
      LEFT JOIN
          CommentCounts 
          ON CommentCounts."post_id" = "post"."id"
      WHERE 
          "post"."published" = true
      ORDER BY 
          "publishedAt" DESC 
      LIMIT 3;
    `);

    return articles.map((article: BlogPost) => this.convertPost(article));
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

  private convertRecord(item: BlogCategory, lang: string = 'uk') {
    item.title = item.title[lang];
    if (item.seoH1) item.seoH1 = item.seoH1[lang];
    if (item.seoTitle) item.seoTitle = item.seoTitle[lang];
    if (item.seoDescription) item.seoDescription = item.seoDescription[lang];
    return item;
  }
}
