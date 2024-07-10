import { Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { StoreService } from './store.service';
import { Store } from './entities/store.entity';
import { Request } from 'express';

@Controller('api/v1')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post('/store/:id/status')
  async setStoreStatus(
    @Param('id') id: number,
    @Req() request: Request,
  ): Promise<Store> {
    const token = request.headers.authorization?.split(' ')[1] ?? [];
    return await this.storeService.setStoreStatus(token, +id);
  }

  @Get('/stores/all')
  async getActiveStores(
    @Req() request: Request,
    @Query('pagination') pagination?: any,
    @Query('orderBy') orderBy?: any,
    @Query('where') where?: any,
  ): Promise<Store[]> {
    const token = request.headers.authorization?.split(' ')[1] ?? [];
    return await this.storeService.getActiveStores(
      token,
      pagination,
      orderBy,
      where,
    );
  }

  @Get('/stores/city/:cityId')
  async getStoresByCityId(@Param('cityId') cityId: number): Promise<Store[]> {
    return await this.storeService.getStoresByCityId(cityId);
  }

  @Get('/store/:id')
  async getStoreById(@Param('id') id: number): Promise<Store> {
    return await this.storeService.getStoreById(+id);
  }
}
