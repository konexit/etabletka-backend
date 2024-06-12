import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogCategory } from './entities/blogCategory.entity';
import { Repository } from 'typeorm';
import { BlogPost } from '../blogPost/entities/blogPost.entity';

@Injectable()
export class BlogCategoryService {
  constructor(
    @InjectRepository(BlogCategory)
    private readonly blogCategoryRepository: Repository<BlogCategory>,
    @InjectRepository(BlogPost)
    private readonly blogPostRepository: Repository<BlogPost>,
  ) {}

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

  async getBlogCategories(): Promise<BlogCategory[]> {
    const blogCategories = await this.blogCategoryRepository.find();
    if (!blogCategories) {
      throw new HttpException(
        'Blog categories not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return blogCategories;
  }
}
