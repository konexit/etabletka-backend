import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { Menu } from './entities/menu.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private jwtService: JwtService,
  ) {}

  cacheAppMenuKey: string = 'appMenu';
  cacheAppMenuTTL: number = 3600000; // 1Hour

  async getMenu(): Promise<any> {
    const cacheMenu = await this.cacheManager.get(this.cacheAppMenuKey);

    if (cacheMenu) {
      return cacheMenu;
    }

    const menu = await this.menuRepository.find({
      relations: ['menuItems'],
      where: { menuItems: { isActive: true } },
    });

    if (!menu) {
      throw new HttpException('Menu not found', HttpStatus.NOT_FOUND);
    }

    await this.cacheManager.set(
      this.cacheAppMenuKey,
      menu,
      this.cacheAppMenuTTL,
    );

    return menu;
  }

  async getMenuBySlug(slug: Menu['slug'], lang: string = 'uk'): Promise<Menu> {
    const cacheMenu = await this.cacheManager.get<Menu>(
      `${this.cacheAppMenuKey}-by-slug`,
    );

    if (cacheMenu) {
      return cacheMenu;
    }

    const menu = await this.menuRepository.findOne({
      relations: ['menuItems'],
      where: { slug: slug },
    });

    if (!menu) {
      throw new HttpException('Menu not found', HttpStatus.NOT_FOUND);
    }

    menu.title = menu.title[lang] || menu.title['uk'];
    menu.menuItems = menu.menuItems
      .map((item) => {
        return {
          ...item,
          title: item.title[lang] || item.title['uk'],
        };
      })
      .sort((a, b) => a.position - b.position);

    await this.cacheManager.set(
      `${this.cacheAppMenuKey}-by-slug`,
      menu,
      this.cacheAppMenuTTL,
    );

    return menu;
  }
}
