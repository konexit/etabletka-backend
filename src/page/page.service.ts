import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Page from './entities/page.entiry';
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
    if (!token || typeof token !== 'string') {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return await this.pageRepository.find({});
  }

  async getPageBySlug(slug: string): Promise<Page> {
    return await this.pageRepository.findOneBy({
      slug,
    });
  }
}
