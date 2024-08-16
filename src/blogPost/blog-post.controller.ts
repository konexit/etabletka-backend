import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpException,
  HttpStatus,
  Get,
  Post,
  Param,
  UseInterceptors,
  Req,
  Query,
  UploadedFile,
} from '@nestjs/common';
import { BlogPostService } from './blog-post.service';
import { BlogPost } from './entities/blog-post.entity';
import { PaginationDto } from '../common/dto/paginationDto';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CreatePost } from './dto/create-post.dto';
import slugify from 'slugify';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('post')
@Controller('api/v1')
export class BlogPostController {
  constructor(private readonly blogPostService: BlogPostService) {}

  @Post('/post')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(FileInterceptor('image', {}))
  async create(
    @Req() request: Request,
    @UploadedFile() image: Express.Multer.File,
    @Body() createPost: CreatePost,
  ) {
    const token = request.headers.authorization?.split(' ')[1] ?? [];
    console.log('publishedAt', createPost.publishedAt);
    try {
      if (createPost.title && typeof createPost.title === 'string') {
        try {
          createPost.title = JSON.parse(createPost.title);
        } catch (error) {
          throw new HttpException(
            'Invalid JSON format in "title" property',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      if (createPost.excerpt && typeof createPost.excerpt === 'string') {
        try {
          createPost.excerpt = JSON.parse(createPost.excerpt);
        } catch (error) {
          throw new HttpException(
            'Invalid JSON format in "excerpt" property',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      if (createPost.content && typeof createPost.content === 'string') {
        try {
          createPost.content = JSON.parse(createPost.content);
        } catch (error) {
          throw new HttpException(
            'Invalid JSON format in "content" property',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      if (createPost.alt && typeof createPost.alt === 'string') {
        try {
          createPost.alt = JSON.parse(createPost.alt);
        } catch (error) {
          throw new HttpException(
            'Invalid JSON format in "alt" property',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      if (!createPost.slug) createPost.slug = slugify(createPost.title['uk']);

      if (createPost.seoH1 && typeof createPost.seoH1 === 'string') {
        try {
          createPost.seoH1 = JSON.parse(createPost.seoH1);
        } catch (error) {
          throw new HttpException(
            'Invalid JSON format in "seoH1" property',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      if (createPost.seoTitle && typeof createPost.seoTitle === 'string') {
        try {
          createPost.seoTitle = JSON.parse(createPost.seoTitle);
        } catch (error) {
          throw new HttpException(
            'Invalid JSON format in "seoTitle" property',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      if (
        createPost.seoDescription &&
        typeof createPost.seoDescription === 'string'
      ) {
        try {
          createPost.seoDescription = JSON.parse(createPost.seoDescription);
        } catch (error) {
          throw new HttpException(
            'Invalid JSON format in "seoTitle" property',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      const post = await this.blogPostService.create(token, createPost);

      if (image) {
        // TODO: add image to CDN and fill cdnData, get new data for entity
        console.log(`Image uploaded: ${image.originalname}`);
      }

      return post;
    } catch (error) {
      throw error;
    }
  }

  @Get('/blog-main')
  async getLatestPosts(): Promise<BlogPost[]> {
    return await this.blogPostService.getLatestPosts();
  }

  @Get('/blogs')
  async getPosts(
    @Req() request: Request,
    @Query('pagination') pagination?: any,
  ): Promise<{ posts: BlogPost[]; pagination: any }> {
    try {
      return await this.blogPostService.getPosts(pagination);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/blog/:category')
  async getCategoryPosts(
    @Param('category') category: string,
    @Body('pagination') pagination?: PaginationDto,
  ): Promise<{ posts: BlogPost[]; total: number }> {
    try {
      return await this.blogPostService.getCategoryPosts(category, pagination);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/blog/:category/:slug')
  async getPost(
    @Param('category') category: string,
    @Param('slug') slug: string,
  ): Promise<BlogPost> {
    return await this.blogPostService.getPost(category, slug);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/post/:id')
  async getPostById(@Param('id') id: number): Promise<BlogPost> {
    return await this.blogPostService.getPostById(id);
  }
}
