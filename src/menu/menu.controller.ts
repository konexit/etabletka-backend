import { Controller, Get, Res } from '@nestjs/common';
import { Menu } from './entities/menu.entity';
import { MenuService } from './menu.service';

@Controller('api/v1/menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  async getMenu(@Res() res: any): Promise<Menu[]> {
    try {
      const menu = await this.menuService.getMenu();

      if (!menu) {
        return res.status(404).json({ message: 'Menu not found' });
      }

      return res.json(menu);
    } catch (error) {
      return res.status(error.status).json(error);
    }
  }
}
