import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';

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

    await this.cacheManager.set(
      this.cacheAppMenuKey,
      menu,
      this.cacheAppMenuTTL,
    );

    return menu;
  }
}
