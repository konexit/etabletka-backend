import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { AnotherPointService } from './anotherPoint.service';
import { AnotherPoint } from './entities/anotherPoint.entity';
import { Request } from 'express';

@Controller('api/v1')
export class AnotherPointController {
  constructor(private readonly anotherPointService: AnotherPointService) {}

  @Get('/markers/another-points')
  async getAnotherPoints(): Promise<AnotherPoint[]> {
    return await this.anotherPointService.getAnotherPoints();
  }

  @Get('/markers/another-point/:id')
  async getAnotherPointById(@Param('id') id: number): Promise<AnotherPoint> {
    return await this.anotherPointService.getAnotherPointById(+id);
  }

  @Post('/markers/another-point/:id/status')
  async setUseIcon(
    @Req() request: Request,
    @Param('id') id: number,
  ): Promise<AnotherPoint> {
    const token = request.headers.authorization?.split(' ')[1] ?? [];
    return await this.anotherPointService.setUseIcon(token, id);
  }
}
