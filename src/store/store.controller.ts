import { Body, Controller, Get, Param, Query, Req } from "@nestjs/common";
import { StoreService } from './store.service';
import { Store } from './entities/store.entity';
import { Request } from 'express';

@Controller('api/v1')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get('/stores/all')
  async getActiveStores(
    @Req() request: Request,
    @Query('pagination') pagination?: any,
  ): Promise<Store[]> {
    const token = request.headers.authorization?.split(' ')[1] ?? [];
    return await this.storeService.getActiveStores(token, pagination);
  }

  @Get('/stores/city/:cityId')
  async getStoresByCityId(@Param('cityId') cityId: number): Promise<Store[]> {
    return await this.storeService.getStoresByCityId(cityId);
  }
}
