import { Body, Controller, Get, Param, Req } from '@nestjs/common';
import { StoreService } from './store.service';
import { Store } from './entities/store.entity';
import { Request } from 'express';
import { PaginationDto } from '../common/dto/paginationDto';

@Controller('api/v1')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get('/stores/all')
  async getActiveStores(
    @Req() request: Request,
    @Body('pagination') pagination?: PaginationDto,
  ): Promise<Store[]> {
    console.log('request', request);
    const token = request.headers.authorization?.split(' ')[1] ?? [];
    return await this.storeService.getActiveStores(token, pagination);
  }

  @Get('/stores/city/:cityId')
  async getStoresByCityId(@Param('cityId') cityId: number): Promise<Store[]> {
    return await this.storeService.getStoresByCityId(cityId);
  }
}
