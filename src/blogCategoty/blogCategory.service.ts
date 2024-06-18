import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogCategory } from './entities/blogCategory.entity';
import { Repository } from 'typeorm';
import { BlogPost } from '../blogPost/entities/blogPost.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class BlogCategoryService {
  constructor(
    @InjectRepository(BlogCategory)
    private readonly blogCategoryRepository: Repository<BlogCategory>,
    @InjectRepository(BlogPost)
    private readonly blogPostRepository: Repository<BlogPost>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  cacheBlogCategoriesKey = 'blogCategories';
  cacheBlogCategoriesTTL = 14400000; // 4 Hour

  async create(): Promise<BlogCategory> {
    return await this.blogCategoryRepository.create();
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

  async getBlogCategories(): Promise<any> {
    const cacheCategories = await this.cacheManager.get(
      this.cacheBlogCategoriesKey,
    );
    if (cacheCategories) {
      return cacheCategories;
    }

    const blogCategories = await this.blogCategoryRepository.find();
    if (!blogCategories) {
      throw new HttpException(
        'Blog categories not found',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.cacheManager.set(
      this.cacheBlogCategoriesKey,
      blogCategories,
      this.cacheBlogCategoriesTTL,
    );

    return blogCategories;
  }
}
