import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { Page } from './entities/page.entity';

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

  async getPagesByMenuIndex(
    index: number,
  ): Promise<ReturnType<PageService['transform']>[]> {
    const cachedPages = await this.cacheManager.get<
      ReturnType<PageService['transform']>[]
    >(`${this.cachePagesKey}-menu-${index}`);

    if (cachedPages) return cachedPages;

    const queryBuilder = this.pageRepository.createQueryBuilder('page');
    const pages = await queryBuilder
      .select('page.id')
      .addSelect('page.slug')
      .addSelect('page.title')
      .where('page.menuIndex = :index', { index })
      .getMany();

    if (!pages)
      throw new HttpException('Pages not found', HttpStatus.NOT_FOUND);

    const result = pages.map((page) => this.transform(page));

    await this.cacheManager.set(
      `${this.cachePagesKey}-menu-${index}`,
      result,
      this.cachePageTTL,
    );

    return result;
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

  transform(
    page: Page,
    lang: string = 'uk',
  ): Omit<Page, 'title'> & { title: string } {
    const result = JSON.parse(JSON.stringify(page));
    result.title = result.title[lang];
    return result;
  }
}
