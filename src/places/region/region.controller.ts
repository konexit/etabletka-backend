import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { RegionService } from './region.service';

@Controller('api/v1/regions')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(@Req() request: Request) {
    const token = request.headers.authorization?.split(' ')[1] ?? [];

    return await this.regionService.getRegions(token);
  }
}
