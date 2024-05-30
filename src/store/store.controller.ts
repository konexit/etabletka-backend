import { Controller, Get, Param, Res } from '@nestjs/common';
import { StoreService } from './store.service';
import { Store } from './entities/store.entity';

@Controller('api/v1/store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  async getActiveStores(@Res() res: any): Promise<Store[]> {
    try {
      const activeStores = await this.storeService.getActiveStores();

      if (!activeStores) {
        return res.status(404).json({ message: 'Active stores not found' });
      }

      return res.json(activeStores);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  @Get('/city/:cityId')
  async getStoresByCityId(
    @Param('cityId') cityId: number,
    @Res() res: any,
  ): Promise<Store[]> {
    try {
      const stores = await this.storeService.getStoresByCityId(cityId);

      if (!stores) {
        return res.status(404).json({ message: 'Active stores not found' });
      }

      return res.json(stores);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
