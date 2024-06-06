import { Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { CityService } from './city.service';
import { City } from './entities/city.entity';
import { Request } from 'express';

@Controller('api/v1')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get('/cities')
  async findAll(@Req() request: Request, @Res() res: any): Promise<any> {
    const token = request.headers.authorization?.split(' ')[1] ?? [];
    try {
      const cities = await this.cityService.getCities(token);

      if (!cities) {
        return res.status(404).json({ message: 'Cities not found' });
      }

      return res.json(cities);
    } catch (error) {
      return res.status(error.status).json(error);
    }
  }

  @Get('/default-city')
  async getDefaultCity(@Res() res: any): Promise<City> {
    try {
      const city = await this.cityService.getDefaultCity();

      if (!city) {
        return res.status(404).json({ message: 'City not found' });
      }

      return res.json(city);
    } catch (error) {
      return res.status(error.status).json(error);
    }
  }

  @Get('/city/:id')
  async getCityById(@Param('id') id: number, @Res() res: any): Promise<City> {
    try {
      const city = await this.cityService.getCityById(+id);

      if (!city) {
        return res.status(404).json({ message: 'City not found' });
      }

      return res.json(city);
    } catch (error) {
      return res.status(error.status).json(error);
    }
  }

  @Post('/city/stores')
  async getCitiesWithStores(@Res() res): Promise<City[]> {
    try {
      const cities = await this.cityService.getCitiesWithStores();

      if (!cities) {
        return res.status(404).json({ message: 'City not found' });
      }

      return res.json(cities);
    } catch (error) {
      return res.status(error.status).json(error);
    }
  }
}
