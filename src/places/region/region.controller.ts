import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';

import { RegionService } from './region.service';

@Controller('api/v1')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/regions')
  async findAll() {
    return await this.regionService.getRegions();
  }
}
