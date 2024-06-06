import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { DistrictService } from './district.service';

@Controller('api/v1/districts')
export class DistrictController {
  constructor(private readonly districtService: DistrictService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async getAllDistricts(@Req() request: Request, @Res() res: any): Promise<any> {
    const token = request.headers.authorization?.split(' ')[1] ?? [];
    try {
      const districts = await this.districtService.getAllDistricts(token);

      if (!districts) {
        return res.status(404).json({ message: 'Regions not found' });
      }

      return res.json(districts);
    } catch (error) {
      return res.status(error.status).json(error);
    }
  }
}
