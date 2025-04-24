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
import { ArticleService } from './article.service';
import { Article } from './entities/article.entity';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { USER_ROLE_JWT_ADMIN } from 'src/user/user.constants';
import { Roles } from 'src/common/decorators/roles.decorator';
import { GetByArticleIdsDto } from './dto/get-by-article-ids.dto';
import { Tag } from './entities/tag.entity';
import { GetByArticleTagsIdsDto } from './dto/get-by-article-tags-ids.dto';

@ApiTags('post')
@Controller('api/v1')
export class ArticleController {
  constructor(private articleService: ArticleService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLE_JWT_ADMIN)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(FileInterceptor('image', {}))
  @Post('article')
  async create(
    @UploadedFile() image: Express.Multer.File,
    @Body() createPost: CreateArticle,
  ) {
    return this.articleService.create(createPost);
  }

  @Get('article')
  async getArticles(
    @Query() pagination?: PaginationDto,
    @Query('tagId', new ParseIntPipe({ optional: true })) tagId?: Tag['id']
  ): Promise<General.Page<Article['id']>> {
    return this.articleService.getArticles(pagination, tagId);
  }

  @Get('article-content/:id')
  async getArticleContent(
    @Param('id', ParseIntPipe) id: Article['id']
  ): Promise<Pick<Article, 'id' | 'content'>> {
    return this.articleService.getArticleContent(id);
  }

  @Post('article/ids')
  async getArticlesByIds(
    @Body() getByArticleIdsDto: GetByArticleIdsDto,
  ): Promise<Omit<Article, 'content'>[]> {
    return this.articleService.getArticlesByIds(getByArticleIdsDto.ids);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLE_JWT_ADMIN)
  @Patch('article/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticle: UpdateArticle,
  ) {
    return this.articleService.update(id, updateArticle);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLE_JWT_ADMIN)
  @Delete('article/:id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.articleService.delete(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('article/:id')
  async getArticleById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Article> {
    return this.articleService.getArticleById(id);
  }

  @Get('article-tags')
  async getArticleTags(): Promise<Tag['id'][]> {
    return this.articleService.getArticleTags();
  }

  @Post('article-tags/ids')
  async getArticleTagsByIds(
    @Body() getByArticleTagsIdsDto: GetByArticleTagsIdsDto
  ): Promise<Tag[]> {
    return this.articleService.getArticleTagsByIds(getByArticleTagsIdsDto.ids);
  }
}
