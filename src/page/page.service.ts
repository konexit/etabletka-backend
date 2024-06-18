import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from './entities/page.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class PageService {
  constructor(
    @InjectRepository(Page)
    private pageRepository: Repository<Page>,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  cachePagesKey = 'pages';
  cacheMenuPagesKey = 'menuPages';
  cachePageTTL = 14400000; // 4 Hour

  async getPages(token: string | any[]): Promise<any> {
    // if (!token || typeof token !== 'string') {
    //   throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    // }

    const cachePages = await this.cacheManager.get(this.cachePagesKey);
    if (cachePages) {
      return cachePages;
    }

    const pages = await this.pageRepository.find({
      where: { isPublished: true },
    });

    if (!pages) {
      throw new HttpException('Pages not found', HttpStatus.NOT_FOUND);
    }

    await this.cacheManager.set(this.cachePagesKey, pages, this.cachePageTTL);

    return pages;
  }

  async getPagesByMenuIndex(index): Promise<any> {
    const cachePages = await this.cacheManager.get(this.cacheMenuPagesKey);
    if (cachePages) {
      return cachePages;
    }

    const queryBuilder = this.pageRepository.createQueryBuilder('page');
    const pages = await queryBuilder
      .select('page.id')
      .addSelect('page.slug')
      .addSelect('page.title')
      .where('page.menuIndex = :index', { index })
      .getMany();

    if (!pages) {
      throw new HttpException('Pages not found', HttpStatus.NOT_FOUND);
    }

    await this.cacheManager.set(
      this.cacheMenuPagesKey,
      pages,
      this.cachePageTTL,
    );

    return pages;
  }

  async getPageBySlug(slug: string): Promise<Page> {
    const page = await this.pageRepository.findOneBy({
      slug,
    });

    if (!page) {
      throw new HttpException('Page not found', HttpStatus.NOT_FOUND);
    }

    return page;
  }
}
