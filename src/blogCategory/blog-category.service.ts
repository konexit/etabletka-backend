import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogCategory } from './entities/blog-category.entity';
import { Repository } from 'typeorm';
import { BlogPost } from '../blogPost/entities/blog-post.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CreateBlogCategory } from './dto/create-blog-category.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateBlogCategory } from './dto/update-blog-category.dto';

@Injectable()
export class BlogCategoryService {
  constructor(
    @InjectRepository(BlogCategory)
    private readonly blogCategoryRepository: Repository<BlogCategory>,
    @InjectRepository(BlogPost)
    private readonly blogPostRepository: Repository<BlogPost>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private jwtService: JwtService,
  ) {}

  cacheBlogCategoriesKey = 'blogCategories';
  cacheBlogCategoriesTTL = 14400000; // 4 Hour

  private convertRecord(item: BlogCategory, lang: string = 'uk') {
    item.title = item.title[lang];
    if (item.seoH1) item.seoH1 = item.seoH1[lang];
    if (item.seoTitle) item.seoTitle = item.seoTitle[lang];
    if (item.seoDescription) item.seoDescription = item.seoDescription[lang];
    return item;
  }

  async create(
    token: string,
    createBlogCategory: CreateBlogCategory,
  ): Promise<BlogCategory> {
    if (!token || typeof token !== 'string') {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const payload = await this.jwtService.decode(token);
    if (payload?.roleId !== 1) {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const blogCategory = this.blogCategoryRepository.create(createBlogCategory);
    if (!blogCategory) {
      throw new HttpException(
        `Can't create discount group with data: ${createBlogCategory}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.cacheManager.set(
      this.cacheBlogCategoriesKey,
      null,
      this.cacheBlogCategoriesTTL,
    );

    return await this.blogCategoryRepository.save(blogCategory);
  }

  async update(
    token: string,
    id: number,
    updateBlogCategory: UpdateBlogCategory,
    lang: string = 'uk',
  ) {
    if (!token || typeof token !== 'string') {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const payload = await this.jwtService.decode(token);
    if (payload?.roleId !== 1) {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    await this.blogCategoryRepository.update(id, updateBlogCategory);
    const blogCategory = await this.blogCategoryRepository.findOne({
      where: { id },
    });

    if (!blogCategory) {
      throw new HttpException(
        `Can't update discount group with data: ${updateBlogCategory}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.cacheManager.set(
      this.cacheBlogCategoriesKey,
      null,
      this.cacheBlogCategoriesTTL,
    );

    return this.convertRecord(blogCategory, lang);
  }

  async addPostToCategory(id: number, postId: number): Promise<void> {
    const category = await this.blogCategoryRepository.findOne({
      where: { id },
      relations: ['posts'],
    });
    const post = await this.blogPostRepository.findOneBy({ id: postId });
    category.posts.push(post);
    await this.blogCategoryRepository.save(category);
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

  async getBlogCategoryById(id: number, lang: string = 'uk') {
    const blogCategory = await this.blogCategoryRepository.findOne({
      where: { id },
    });

    if (!blogCategory) {
      throw new HttpException('Blog category not found', HttpStatus.NOT_FOUND);
    }

    return this.convertRecord(blogCategory, lang);
  }
}
