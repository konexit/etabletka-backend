import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Menu } from './entities/menu.entity';
import { MenuService } from './menu.service';

@ApiTags('menu')
@Controller('api/v1/menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  async getMenu(): Promise<Menu[]> {
    return await this.menuService.getMenu();
  }

  @Get('/:slug')
  async getMenuBySlug(
    @Param('slug') slug: Menu['slug'],
    @Param('lang') lang: string,
  ): Promise<Menu> {
    return await this.menuService.getMenuBySlug(slug, lang);
  }
}
