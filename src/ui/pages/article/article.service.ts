import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Raw, Repository, SelectQueryBuilder } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Article } from './entities/article.entity';
import { Tag } from './entities/tag.entity';
import { CreateArticle } from './dto/create-article.dto';
import { UpdateArticle } from './dto/update-article.dto';

@Injectable()
export class ArticleService {
  private cacheTagsKey = 'tags';
  private cacheTagsTTL = 3600_000; // 1 Hour

  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) { }

  async getTags(lang = 'uk') {
    const cachetags = await this.cacheManager.get(this.cacheTagsKey);
    if (cachetags) {
      return cachetags;
    }

    const tags = await this.tagRepository.find({
      order: { id: 'ASC' },
    });
    if (!tags) {
      throw new HttpException('Blog tags not found', HttpStatus.NOT_FOUND);
    }

    for (let tag of tags) {
      tag = this.convertRecord(tag, lang);
    }

    await this.cacheManager.set(this.cacheTagsKey, tags, this.cacheTagsTTL);

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
      article.tags = createPost.tags;
    }

    return this.convertPostLang(await this.articleRepository.save(article));
  }

  async update(id: number, updateArticle: UpdateArticle) {
    const tagIds = updateArticle.tags;
    delete updateArticle.tags;

    await this.articleRepository.update(id, updateArticle);
    const article: Article = await this.articleRepository.findOne({ where: { id } });
    if (!article) {
      throw new HttpException(
        `Can't update article with data: ${updateArticle}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    article.tags = tagIds ? tagIds : [];

    return this.convertPostLang(await this.articleRepository.save(article));
  }

  async delete(id: number): Promise<void> {
    const article = await this.articleRepository.findOneBy({ id });
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
      .leftJoin('article.author', 'author')
      .leftJoin('article.censor', 'censor');

    if (ids) query.where('article.id IN (:...ids)', { ids: ids });

    query.orderBy('article.publishedAt', 'DESC').take(take).skip(skip);

    return query.getMany();
  }

  async addCategoryToPost(id: number, tagId: number): Promise<void> {
    const article = await this.articleRepository.findOne({ where: { id } });

    article.tags.push(tagId);

    await this.articleRepository.save(article);
  }

  async getArticles(pagination: PaginationDto = {}, tagId?: Tag['id']): Promise<General.Page<Omit<Article, 'content'>>> {
    const { take = 15, skip = 0 } = pagination;
    const where: FindOptionsWhere<Article> = { isPublished: true };

    if (tagId) {
      where.tags = Raw((alias) => `${alias} @> ARRAY[${tagId}]::int[]`)
    }

    const [articles, total] = await this.articleRepository.findAndCount({
      select: [
        'id',
        'authorId',
        'censorId',
        'title',
        'excerpt',
        'alt',
        'seoH1',
        'seoTitle',
        'seoDescription',
        'seoKeywords',
        'image',
        'commentsCount',
        'tags',
        'publishedAt'
      ],
      take,
      skip,
      where,
      order: { publishedAt: 'DESC' },
    });

    if (articles) {
      for (let article of articles) {
        article = this.convertPostLang(article);
      }
    }

    return {
      items: articles,
      pagination: {
        take,
        skip,
        total,
      },
    };
  }

  async getArticlesByIds(articleIds: Article['id'][]): Promise<Article[]> {
    const articles = await this.articleRepository.find({ where: { id: In(articleIds) } });

    if (!articles.length)
      throw new HttpException('Articles not found', HttpStatus.NOT_FOUND);

    for (const article of articles) {
      Object.assign(article, this.convertPostLang(article));
    }

    return articles;
  }

  async getArticlesByTag(
    slug: string,
    pagination: PaginationDto = {},
  ): Promise<General.Page<Article>> {
    const { take = 15, skip = 0 } = pagination;

    const tag = await this.tagRepository.findOne({ where: { slug } });

    if (!tag) {
      throw new HttpException('Posts tags not found', HttpStatus.NOT_FOUND);
    }

    if (!tag.articles.length) {
      return {
        items: [],
        pagination: {
          total: 0,
          skip,
          take,
        },
      };
    }

    const queryBuilder: SelectQueryBuilder<Article> =
      this.articleRepository.createQueryBuilder('article');
    const total = await queryBuilder
      .where('article.id IN (:...ids)', { ids: tag.articles })
      .getCount();

    const articles = await this.fetchData(queryBuilder, take, skip, tag.articles);

    if (articles) {
      for (const article of articles) {
        Object.assign(article, this.convertPostLang(article));
      }
    }

    return {
      items: articles,
      pagination: {
        total,
        skip,
        take,
      },
    };
  }

  async getArticle(tag: string, slug: string): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['author', 'censor'],
    });
    if (!article) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    return this.convertPostLang(article);
  }

  async getArticleById(id: number) {
    const article = await this.articleRepository.findOne({
      where: { id },
      relations: ['author.profile', 'censor.profile'],
    });
    if (!article) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    return this.convertPostLang(article);
  }

  private convertPostLang(article: Article, lang = 'uk'): Article {
    article.title = article.title[lang];

    if (article.excerpt) {
      article.excerpt = article.excerpt[lang] ?? '';
    }

    if (article.content) {
      article.content = article.content[lang];
    }

    if (article.alt) {
      article.alt = article.alt[lang] ?? '';
    }

    if (article.seoH1) {
      article.seoH1 = article.seoH1[lang] ?? '';
    }

    if (article.seoTitle) {
      article.seoTitle = article.seoTitle[lang] ?? '';
    }

    if (article.seoDescription) {
      article.seoDescription = article.seoDescription[lang] ?? '';
    }

    if (article.seoKeywords) {
      article.seoKeywords = article.seoKeywords[lang] ?? '';
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
