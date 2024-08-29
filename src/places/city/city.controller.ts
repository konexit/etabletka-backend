import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Query,
  Req,
} from '@nestjs/common';
import { CityService } from './city.service';
import { City } from './entities/city.entity';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { UpdateCity } from './dto/update-city.dto';

@ApiTags('cities')
@Controller('api/v1')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Patch('/city/:id')
  async update(
    @Req() request: Request,
    @Param('id') id: number,
    @Body() updateCity: UpdateCity,
  ) {
    const token = request.headers.authorization?.split(' ')[1] ?? '';

    if (updateCity.name && typeof updateCity.name === 'string') {
      try {
        updateCity.name = JSON.parse(updateCity.name);
      } catch (error) {
        throw new HttpException(
          'Invalid JSON format in "name" property',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (updateCity.prefix && typeof updateCity.prefix === 'string') {
      try {
        updateCity.prefix = JSON.parse(updateCity.prefix);
      } catch (error) {
        throw new HttpException(
          'Invalid JSON format in "prefix" property',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    try {
      return await this.cityService.update(token, +id, updateCity);
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
