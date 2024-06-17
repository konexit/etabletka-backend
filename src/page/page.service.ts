import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from './entities/page.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class PageService {
  constructor(
    @InjectRepository(Page)
    private pageRepository: Repository<Page>,
    private jwtService: JwtService,
  ) {}

  async getPages(token: string | any[]): Promise<any> {
    // if (!token || typeof token !== 'string') {
    //   throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    // }

    const pages = await this.pageRepository.find({
      where: { isPublished: true }
    });

    if (!pages) {
      throw new HttpException('Pages not found', HttpStatus.NOT_FOUND);
    }

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
