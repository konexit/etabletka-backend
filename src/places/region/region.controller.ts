import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { RegionService } from './region.service';

@Controller('regions')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(@Req() request: Request, @Res() res) {
    const token = request.headers.authorization?.split(' ')[1] ?? [];
    try {
      const regions = await this.regionService.getRegions(token);

      if (!regions) {
        return res.status(404).json({ message: 'Regions not found' });
      }

      return res.json(regions);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
