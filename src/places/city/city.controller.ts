import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { CityService } from './city.service';
import { City } from './entities/city.entity';
import { Request } from 'express';

@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(@Req() request: Request, @Res() res): Promise<any> {
    const token = request.headers.authorization?.split(' ')[1] ?? [];
    try {
      const cities = await this.cityService.getCities(token);

      if (!cities) {
        return res.status(404).json({ message: 'Cities not found' });
      }

      return res.json(cities);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  @Get(':id')
  async getCityById(@Param('id') id: number, @Res() res): Promise<City> {
    try {
      const city = await this.cityService.getCityById(+id);

      if (!city) {
        return res.status(404).json({ message: 'City not found' });
      }

      return res.json(city);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
