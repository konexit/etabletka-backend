import { Controller, Get } from '@nestjs/common';
import { Menu } from './entities/menu.entity';
import { MenuService } from './menu.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('menu')
@Controller('api/v1/menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  async getMenu(): Promise<Menu[]> {
    return await this.menuService.getMenu();
  }
}
