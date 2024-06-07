import { Controller, Get, Param } from '@nestjs/common';
import { AnotherPointService } from './anotherPoint.service';
import { AnotherPoint } from './entities/anotherPoint.entity';

@Controller('api/v1')
export class AnotherPointController {
  constructor(private readonly anotherPointService: AnotherPointService) {}

  @Get('/another-points')
  async getAnotherPoints(): Promise<AnotherPoint[]> {
    return await this.anotherPointService.getAnotherPoints();
  }

  @Get('/another-point/:id')
  async getAnotherPointById(@Param('id') id: number): Promise<AnotherPoint> {
    return await this.anotherPointService.getAnotherPointById(+id);
  }
}
