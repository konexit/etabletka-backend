import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreatePost } from './dto/create-post.dto';
import { UpdatePost } from './dto/update-post.dto';
import { BlogService } from './blog.service';
import { BlogPost } from './entities/blog-post.entity';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { USER_ROLE_JWT_ADMIN } from 'src/user/user.constants';
import { Roles } from 'src/common/decorators/roles.decorator';
import { BlogCategory } from './entities/blog-category.entity';

@ApiTags('post')
@Controller('api/v1')
export class BlogPostController {
  constructor(private blogService: BlogService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLE_JWT_ADMIN)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(FileInterceptor('image', {}))
  @Post('/post')
  async create(
    @UploadedFile() image: Express.Multer.File,
    @Body() createPost: CreatePost,
  ) {
    return this.blogService.create(createPost);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLE_JWT_ADMIN)
  @Patch('/post/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePost: UpdatePost
  ) {
    return this.blogService.update(id, updatePost);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLE_JWT_ADMIN)
  @Delete('/post/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.delete(id);
  }

  @Get('/blog-main')
  async getLatestPosts(): Promise<BlogPost[]> {
    return this.blogService.getLatestPosts();
  }

  @Get('/blogs')
  async getPosts(
    @Query() pagination?: PaginationDto,
  ): Promise<{ posts: BlogPost[]; total: number }> {
    return this.blogService.getPosts(pagination);
  }
  
  @Get('/blog-categories')
  async getBlogCategories(): Promise<BlogCategory[]> {
    return this.blogService.getBlogCategories();
  }

  @Get('/blog/:category')
  async getCategoryPosts(
    @Param('category') category: string,
    @Query() pagination?: PaginationDto,
  ): Promise<{ posts: BlogPost[]; total: number }> {
    return this.blogService.getCategoryPosts(category, pagination);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/blog/:category/:slug')
  async getPost(
    @Param('category') category: string,
    @Param('slug') slug: string,
  ): Promise<BlogPost> {
    return this.blogService.getPost(category, slug);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/post/:id')
  async getPostById(@Param('id', ParseIntPipe) id: number): Promise<BlogPost> {
    return this.blogService.getPostById(id);
  }
}
