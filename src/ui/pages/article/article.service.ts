import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Raw, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Article } from './entities/article.entity';
import { Tag } from './entities/tag.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>
  ) { }

  async createArticle(createArticleDto: CreateArticleDto, lang = 'uk'): Promise<Article> {
    const newArticle = this.articleRepository.create(Object.assign(createArticleDto, { slug: slugify(createArticleDto.title[lang]) }));
    if (!newArticle) {
      throw new HttpException(
        `Can't create article with data: ${createArticleDto}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.articleRepository.save(newArticle);
  }

  async patchArticle(id: number, updateArticleDto: UpdateArticleDto): Promise<Article> {
    await this.articleRepository.update(id, updateArticleDto);

    const article: Article = await this.articleRepository.findOne({ where: { id } });
    if (!article) {
      throw new HttpException(`Can't update article`, HttpStatus.BAD_REQUEST);
    }

    return article;
  }

  async deleteArticle(id: number): Promise<void> {
    const article = await this.articleRepository.findOneBy({ id });
    if (!article) {
      throw new HttpException('Can`t delete article', HttpStatus.NOT_FOUND);
    }

    await this.articleRepository.delete(id);
  }

  async getArticles(pagination: PaginationDto = {}, tagId?: Tag['id']): Promise<General.Page<Article['id']>> {
    const { take = 15, skip = 0 } = pagination;
    const where: FindOptionsWhere<Article> = { isPublished: true };

    if (tagId) {
      where.tags = Raw((alias) => `${alias} @> ARRAY[${tagId}]::int[]`)
    }

    const [articles, total] = await this.articleRepository.findAndCount({
      select: ['id'],
      take,
      skip,
      where,
      order: { publishedAt: 'DESC' },
    });

    return {
      items: articles.map(item => item.id),
      pagination: {
        take,
        skip,
        total,
      },
    };
  }

  async getArticlesByIds(articleIds: Article['id'][]): Promise<Omit<Article, 'content'>[]> {
    const articles = await this.articleRepository.find({
      select: [
        'id',
        'authorId',
        'censorId',
        'title',
        'slug',
        'excerpt',
        'alt',
        'seoH1',
        'seoTitle',
        'seoDescription',
        'seoKeywords',
        'image',
        'commentsCount',
        'publishedAt',
        'tags'
      ],
      where: { id: In(articleIds) }
    });

    if (!articles.length)
      throw new HttpException('Articles not found', HttpStatus.NOT_FOUND);

    for (let article of articles) {
      article = this.extractArticleLang(article);
    }

    return articles;
  }

  async getArticleContent(id: number, lang = 'uk'): Promise<Pick<Article, 'id' | 'content'>> {
    const article = await this.articleRepository.findOne({
      select: ['id', 'content'],
      where: { id }
    });

    if (!article)
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);

    if (article.content) {
      article.content = article.content[lang];
    }

    return article;
  }

  async getArticleRelated(id: Article['id'], take: number): Promise<Article['id'][]> {
    const originalArticle = await this.articleRepository.findOne({
      where: { id },
      select: ['id', 'tags'],
    });

    if (!originalArticle)
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);

    const related = await this.articleRepository
      .createQueryBuilder('article')
      .select('article.id')
      .where('article.id != :id', { id })
      .andWhere('article.tags && :tags', { tags: originalArticle.tags })
      .orderBy('RANDOM()')
      .limit(take)
      .getMany();

    return related.map(article => article.id);
  }

  async createArticleTag(createTagDto: CreateTagDto, lang = 'uk'): Promise<Tag> {
    const newTag = this.tagRepository.create(Object.assign(createTagDto, { slug: slugify(createTagDto.title[lang]) }));
    if (!newTag) {
      throw new HttpException(
        `Can't create article tag with data: ${createTagDto}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.tagRepository.save(newTag);
  }

  async getArticleById(id: number): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { id },
      relations: ['author.profile', 'censor.profile'],
    });
    if (!article) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }

    return this.extractArticleLang(article);
  }

  async getArticleTags(): Promise<Tag['id'][]> {
    const tags = await this.tagRepository.find({ select: ['id'], order: { id: 'ASC' } });
    if (!tags) {
      throw new HttpException('Article tags not found', HttpStatus.NOT_FOUND);
    }

    return tags.map(tag => tag.id);
  }

  async getArticleTagsByIds(tagIds: Tag['id'][]): Promise<Tag[]> {
    const tags = await this.tagRepository.find({
      select: [
        'id',
        'title',
        'slug',
        'seoTitle',
        'seoH1',
        'seoDescription',
        'seoKeywords',
        'seoText'
      ],
      where: { id: In(tagIds) }
    });

    if (!tags.length)
      throw new HttpException('Articles tags not found', HttpStatus.NOT_FOUND);

    for (let tag of tags) {
      tag = this.extractTagLang(tag);
    }

    return tags;
  }

  async patchArticleTag(id: number, updateTagDto: UpdateTagDto): Promise<Tag> {
    await this.tagRepository.update(id, updateTagDto);

    const tag: Tag = await this.tagRepository.findOne({ where: { id } });
    if (!tag) {
      throw new HttpException(`Can't update article tag`, HttpStatus.BAD_REQUEST);
    }

    return tag;
  }

  private extractArticleLang(article: Article, lang = 'uk'): Article {
    article.title = article.title[lang];

    if (article.excerpt) {
      article.excerpt = article.excerpt[lang] ?? '';
    }

    if (article.content) {
      article.content = article.content[lang] ?? '';
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

  private extractTagLang(tag: Tag, lang = 'uk'): Tag {
    tag.title = tag.title[lang];

    if (tag.seoH1) {
      tag.seoH1 = tag.seoH1[lang] ?? '';
    }

    if (tag.seoTitle) {
      tag.seoTitle = tag.seoTitle[lang] ?? '';
    }

    if (tag.seoDescription) {
      tag.seoDescription = tag.seoDescription[lang] ?? '';
    }

    if (tag.seoKeywords) {
      tag.seoKeywords = tag.seoKeywords[lang] ?? '';
    }

    if (tag.seoText) {
      tag.seoText = tag.seoText[lang] ?? '';
    }

    return tag;
  }
}
