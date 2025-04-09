import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, SelectQueryBuilder } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Article } from './entities/article.entity';
import { Tag } from './entities/tag.entity';
import { CreateArticle } from './dto/create-article.dto';
import { UpdateArticle } from './dto/update-article.dto';

@Injectable()
export class BlogService {
  private cacheTagsKey = 'tags';
  private cacheTagsTTL = 3600_000; // 1 Hour

  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache
  ) { }

  async addTags(ids: Array<number>) {
    return this.tagRepository.find({
      where: { id: In(ids) },
    });
  }

  async getTags(lang = 'uk') {
    const cachetags = await this.cacheManager.get(
      this.cacheTagsKey,
    );
    if (cachetags) {
      return cachetags;
    }

    const tags = await this.tagRepository.find({
      order: { id: 'ASC' },
    });
    if (!tags) {
      throw new HttpException(
        'Blog tags not found',
        HttpStatus.NOT_FOUND,
      );
    }

    for (let tag of tags) {
      tag = this.convertRecord(tag, lang);
    }

    await this.cacheManager.set(
      this.cacheTagsKey,
      tags,
      this.cacheTagsTTL,
    );

    return tags;
  }

  async create(createPost: CreateArticle) {
    const article = this.articleRepository.create(createPost);
    if (!article) {
      throw new HttpException(
        `Can't create article with data: ${createPost}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (createPost.tags) {
      const ids: Array<number> = String(createPost.tags)
        .split(',')
        .map(Number);

      article.tags = await this.addTags(ids);
    }

    return this.convertPost(await this.articleRepository.save(article));
  }

  async update(id: number, updateArticle: UpdateArticle) {
    const tagIds = updateArticle.tags;
    delete updateArticle.tags;

    await this.articleRepository.update(id, updateArticle);
    const article: Article = await this.articleRepository.findOne({
      where: { id },
      relations: ['tags'],
    });
    if (!article) {
      throw new HttpException(
        `Can't update article with data: ${updateArticle}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (tagIds) {
      if (!Array.isArray(tagIds)) {
        const ids: Array<number> = String(tagIds)
          .split(',')
          .map(Number);

        console.log('GroupIds', ids);
        article.tags = await this.addTags(ids);
      } else {
        article.tags = await this.addTags(tagIds);
      }
    } else {
      article.tags = [];
    }

    return this.convertPost(await this.articleRepository.save(article));
  }

  async delete(id: number): Promise<void> {
    const article = await this.articleRepository.findOneBy({
      id: id,
    });
    if (!article) {
      throw new HttpException('Can`t delete article', HttpStatus.NOT_FOUND);
    }

    await this.articleRepository.delete(id);
  }

  public async fetchData(
    queryBuilder: SelectQueryBuilder<Article>,
    take: number,
    skip: number,
    ids?: Array<number>,
  ) {
    const query = queryBuilder
      .select('article')
      .addSelect('author.id')
      .addSelect('author.firstName')
      .addSelect('author.lastName')
      .addSelect('censor.firstName')
      .addSelect('censor.id')
      .addSelect('censor.lastName')
      .addSelect('tags.id')
      .addSelect('tags.slug')
      .addSelect('tags.title')
      .leftJoin('article.tags', 'tags')
      .leftJoin('article.author', 'author')
      .leftJoin('article.censor', 'censor');

    if (ids) query.where('article.id IN (:...ids)', { ids: ids });

    query.orderBy('article.publishedAt', 'DESC').take(take).skip(skip);

    return query.getMany();
  }

  async addCategoryToPost(id: number, tagId: number): Promise<void> {
    const article = await this.articleRepository.findOne({
      where: { id },
      relations: ['tags'],
    });

    const tag = await this.tagRepository.findOneBy({
      id: tagId,
    });
    article.tags.push(tag);
    await this.articleRepository.save(article);
  }

  async getArticles(pagination: PaginationDto = {}): Promise<General.Page<Article>> {
    const { take = 15, skip = 0 } = pagination;
    const queryBuilder = this.articleRepository.createQueryBuilder('article');
    const articles = await this.fetchData(queryBuilder, take, skip);
    if (articles) {
      for (let article of articles) {
        article = this.convertPost(article);
      }
    }

    return {
      items: articles,
      pagination: {
        take,
        skip,
        total: await queryBuilder.getCount()
      },
    };
  }

  async getArticlesByTag(slug: string, pagination: PaginationDto = {}): Promise<General.Page<Article>> {
    const { take = 15, skip = 0 } = pagination;

    const tag = await this.tagRepository.findOne({
      where: { slug },
      relations: ['articles'],
    });

    if (!tag) {
      throw new HttpException(
        'Posts tags not found',
        HttpStatus.NOT_FOUND,
      );
    }

    const articleIds = tag?.articles.map((p: Article) => p.id) || [];

    if (!articleIds.length) {
      return {
        items: [],
        pagination: {
          total: 0,
          skip,
          take
        }
      };
    }

    const queryBuilder: SelectQueryBuilder<Article> = this.articleRepository.createQueryBuilder('article');
    const total = await queryBuilder
      .where('article.id IN (:...ids)', { ids: articleIds })
      .getCount();

    const articles = await this.fetchData(queryBuilder, take, skip, articleIds);

    if (articles) {
      for (const article of articles) {
        Object.assign(article, this.convertPost(article));
      }
    }

    return {
      items: articles,
      pagination: {
        total,
        skip,
        take
      }
    };
  }

  async getArticle(tag: string, slug: string): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: [
        'tags',
        'author',
        'censor',
      ],
    });
    if (!article) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    return this.convertPost(article);
  }

  async getArticleById(id: number) {
    const article = await this.articleRepository.findOne({
      where: { id },
      relations: [
        'tags',
        'author.profile',
        'censor.profile'
      ]
    });
    if (!article) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    return this.convertPost(article);
  }

  private convertPost(article: Article, lang = 'uk'): Article {
    article.title = article.title[lang];

    if (article.excerpt) {
      article.excerpt = article.excerpt[lang];
    }

    if (article.content) {
      article.content = article.content[lang];
    }

    if (article.alt) {
      article.alt = article.alt[lang];
    }

    if (article.seoH1) {
      article.seoH1 = article.seoH1[lang];
    }

    if (article.seoTitle) {
      article.seoTitle = article.seoTitle[lang];
    }

    if (article.seoDescription) {
      article.seoDescription = article.seoDescription[lang];
    }

    if (article.tags) {
      for (const tag of article.tags) {
        tag.title = tag.title[lang];
      }
    }

    return article;
  }

  private convertRecord(item: Tag, lang = 'uk'): Tag {
    item.title = item.title[lang];

    if (item.seoH1) {
      item.seoH1 = item.seoH1[lang];
    }

    if (item.seoTitle) {
      item.seoTitle = item.seoTitle[lang];
    }

    if (item.seoDescription) {
      item.seoDescription = item.seoDescription[lang];
    }

    return item;
  }
}
