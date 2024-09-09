import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import slugify from 'slugify';
import { PaginationDto } from '../common/dto/paginationDto';
import { BlogPostService } from './blog-post.service';
import { CreatePost } from './dto/create-post.dto';
import { UpdatePost } from './dto/update-post.dto';
import { BlogPost } from './entities/blog-post.entity';

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
    const token = request.headers.authorization?.split(' ')[1] ?? '';
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

  @Patch('/post/:id')
  async update(
    @Req() request: Request,
    @Param('id') id: number,
    @Body() updatePost: UpdatePost,
  ) {
    const token = request.headers.authorization?.split(' ')[1] ?? '';

    try {
      if (updatePost.title && typeof updatePost.title === 'string') {
        try {
          updatePost.title = JSON.parse(updatePost.title);
        } catch (error) {
          throw new HttpException(
            'Invalid JSON format in "title" property',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      if (updatePost.excerpt && typeof updatePost.excerpt === 'string') {
        try {
          updatePost.excerpt = JSON.parse(updatePost.excerpt);
        } catch (error) {
          throw new HttpException(
            'Invalid JSON format in "excerpt" property',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      if (updatePost.content && typeof updatePost.content === 'string') {
        try {
          updatePost.content = JSON.parse(updatePost.content);
        } catch (error) {
          throw new HttpException(
            'Invalid JSON format in "content" property',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      if (updatePost.alt && typeof updatePost.alt === 'string') {
        try {
          updatePost.alt = JSON.parse(updatePost.alt);
        } catch (error) {
          throw new HttpException(
            'Invalid JSON format in "alt" property',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      if (updatePost.seoH1 && typeof updatePost.seoH1 === 'string') {
        try {
          updatePost.seoH1 = JSON.parse(updatePost.seoH1);
        } catch (error) {
          throw new HttpException(
            'Invalid JSON format in "seoH1" property',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      if (updatePost.seoTitle && typeof updatePost.seoTitle === 'string') {
        try {
          updatePost.seoTitle = JSON.parse(updatePost.seoTitle);
        } catch (error) {
          throw new HttpException(
            'Invalid JSON format in "seoTitle" property',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      if (
        updatePost.seoDescription &&
        typeof updatePost.seoDescription === 'string'
      ) {
        try {
          updatePost.seoDescription = JSON.parse(updatePost.seoDescription);
        } catch (error) {
          throw new HttpException(
            'Invalid JSON format in "seoTitle" property',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      return await this.blogPostService.update(token, +id, updatePost);
    } catch (error) {
      throw error;
    }
  }

  @Delete('/post/:id')
  async delete(@Req() request: Request, @Param('id') id: number) {
    const token = request.headers.authorization?.split(' ')[1] ?? '';
    try {
      return await this.blogPostService.delete(token, id);
    } catch (e) {
      console.error(e.message);
      throw e;
    }
  }

  @Get('/blog-main')
  async getLatestPosts(): Promise<BlogPost[]> {
    return await this.blogPostService.getLatestPosts();
  }

  @Get('/blogs')
  async getPosts(
    @Query() pagination?: PaginationDto,
  ): Promise<{ posts: BlogPost[]; pagination: any }> {
    try {
      return await this.blogPostService.getPosts(pagination);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/blog/:category')
  async getCategoryPosts(
    @Param('category') category: string,
    @Query() pagination?: PaginationDto,
  ): Promise<{ posts: BlogPost[]; total: number }> {
    try {
      return await this.blogPostService.getCategoryPosts(category, pagination);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }

      throw error;
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
