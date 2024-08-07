import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { Region } from './entities/region.entity';
import { RegionService } from './region.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('regions')
@Controller('api/v1')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/regions')
  async findAll(): Promise<Region[]> {
    return await this.regionService.getRegions();
  }
}
