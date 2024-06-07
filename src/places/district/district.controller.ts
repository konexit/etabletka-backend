import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { DistrictService } from './district.service';

@Controller('api/v1/districts')
export class DistrictController {
  constructor(private readonly districtService: DistrictService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async getAllDistricts(@Req() request: Request): Promise<any> {
    const token = request.headers.authorization?.split(' ')[1] ?? [];
    return await this.districtService.getAllDistricts(token);
  }
}
