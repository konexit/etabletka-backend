import { Controller, Get, Param, Patch, Query, Req } from "@nestjs/common";
import { CityService } from './city.service';
import { City } from './entities/city.entity';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('cities')
@Controller('api/v1')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Patch('/city/:id')
  async update(@Req() request: Request, @Param('id') id: number) {
    const token = request.headers.authorization?.split(' ')[1] ?? '';
    try {

    } catch (e) {
      throw e;
    }
  }

  @Get('/cities')
  async findAll(@Req() request: Request): Promise<any> {
    const token = request.headers.authorization?.split(' ')[1] ?? '';

    return await this.cityService.getCities(token);
  }

  @Get('/default-city')
  async getDefaultCity(): Promise<City> {
    return await this.cityService.getDefaultCity();
  }

  @Get('/city/:id')
  async getCityById(@Param('id') id: number): Promise<City> {
    return await this.cityService.getCityById(+id);
  }

  @Get('/cities/stores')
  async getCitiesWithStores(
    @Req() request: Request,
    @Query('pagination') pagination?: any,
    @Query('orderBy') orderBy?: any,
  ): Promise<City[]> {
    const token = request.headers.authorization?.split(' ')[1] ?? '';
    return await this.cityService.getCitiesWithStores(
      token,
      pagination,
      orderBy,
    );
  }
}
