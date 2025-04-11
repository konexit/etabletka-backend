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
import { CreateArticle } from './dto/create-article.dto';
import { UpdateArticle } from './dto/update-article.dto';
import { BlogService } from './blog.service';
import { Article } from './entities/article.entity';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { USER_ROLE_JWT_ADMIN } from 'src/user/user.constants';
import { Roles } from 'src/common/decorators/roles.decorator';
import { GetByArticleIdsDto } from './dto/get-by-article-ids.dto';

@ApiTags('post')
@Controller('api/v1')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLE_JWT_ADMIN)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(FileInterceptor('image', {}))
  @Post('article/create')
  async create(
    @UploadedFile() image: Express.Multer.File,
    @Body() createPost: CreateArticle,
  ) {
    return this.blogService.create(createPost);
  }

  @Post('article/ids')
  async getArticlesByIds(
    @Body() getByArticleIdsDto: GetByArticleIdsDto,
  ): Promise<Article[]> {
    return this.blogService.getArticlesByIds(getByArticleIdsDto.ids);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLE_JWT_ADMIN)
  @Patch('article/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticle: UpdateArticle,
  ) {
    return this.blogService.update(id, updateArticle);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLE_JWT_ADMIN)
  @Delete('article/:id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.blogService.delete(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('article/:id')
  async getArticleById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Article> {
    return this.blogService.getArticleById(id);
  }

  @Get('blogs')
  async getArticles(
    @Query() pagination?: PaginationDto,
  ): Promise<General.Page<Article>> {
    return this.blogService.getArticles(pagination);
  }

  @Get('tags')
  async getTags() {
    return this.blogService.getTags();
  }

  @Get('blog/:category')
  async getArticlesByTag(
    @Param('category') category: string,
    @Query() pagination?: PaginationDto,
  ): Promise<General.Page<Article>> {
    return this.blogService.getArticlesByTag(category, pagination);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('blog/:category/:slug')
  async getArticle(
    @Param('category') category: string,
    @Param('slug') slug: string,
  ): Promise<Article> {
    return this.blogService.getArticle(category, slug);
  }
}
