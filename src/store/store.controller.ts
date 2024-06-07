import { Controller, Get, Param } from '@nestjs/common';
import { StoreService } from './store.service';
import { Store } from './entities/store.entity';

@Controller('api/v1/store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  async getActiveStores(): Promise<Store[]> {
    return await this.storeService.getActiveStores();
  }

  @Get('/city/:cityId')
  async getStoresByCityId(@Param('cityId') cityId: number): Promise<Store[]> {
    return await this.storeService.getStoresByCityId(cityId);
  }
}
