import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleService } from './article.service';
import { Article } from './entities/article.entity';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { USER_ROLE_JWT_ADMIN } from 'src/user/user.constants';
import { Roles } from 'src/common/decorators/roles.decorator';
import { GetByArticleIdsDto } from './dto/get-by-article-ids.dto';
import { Tag } from './entities/tag.entity';
import { GetByArticleTagsIdsDto } from './dto/get-by-article-tags-ids.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { CreateTagDto } from './dto/create-tag.dto';

@ApiTags('post')
@Controller('api/v1')
export class ArticleController {
  constructor(private articleService: ArticleService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLE_JWT_ADMIN)
  @Post('article')
  async createArticle(
    @Body() createArticleDto: CreateArticleDto
  ): Promise<Article> {
    return this.articleService.createArticle(createArticleDto);
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
  async patchArticle(
    @Param('id', ParseIntPipe) id: Article['id'],
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    return this.articleService.patchArticle(id, updateArticleDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLE_JWT_ADMIN)
  @Delete('article/:id')
  async deleteArticle(@Param('id', ParseIntPipe) id: Article['id']): Promise<void> {
    return this.articleService.deleteArticle(id);
  }

  @Get('article/:id')
  async getArticleById(
    @Param('id', ParseIntPipe) id: Article['id'],
  ): Promise<Article> {
    return this.articleService.getArticleById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLE_JWT_ADMIN)
  @Post('article-tag')
  async createArticleTag(
    @Body() createTagDto: CreateTagDto
  ): Promise<Tag> {
    return this.articleService.createArticleTag(createTagDto);
  }

  @Get('article-tag')
  async getArticleTags(): Promise<Tag['id'][]> {
    return this.articleService.getArticleTags();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLE_JWT_ADMIN)
  @Patch('article-tag/:id')
  async patchArticleTag(
    @Param('id', ParseIntPipe) id: Tag['id'],
    @Body() updateTagDto: UpdateTagDto,
  ): Promise<Tag> {
    return this.articleService.patchArticleTag(id, updateTagDto);
  }

  @Post('article-tag/ids')
  async getArticleTagsByIds(
    @Body() getByArticleTagsIdsDto: GetByArticleTagsIdsDto
  ): Promise<Tag[]> {
    return this.articleService.getArticleTagsByIds(getByArticleTagsIdsDto.ids);
  }
}
