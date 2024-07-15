import { Controller, Get, Param, Put, Post, Req, Body, UseInterceptors, UploadedFile } from "@nestjs/common";
import { AnotherPointService } from './anotherPoint.service';
import { AnotherPoint } from './entities/anotherPoint.entity';
import { Request } from 'express';
import { UpdateAnothePoint } from './dto/update-anothe-point.dto';
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('api/v1')
export class AnotherPointController {
  constructor(private readonly anotherPointService: AnotherPointService) {}

  @Post('/another-point/update/:id/icon')
  @UseInterceptors(FileInterceptor('image', {}))
  async updateImage(
    @Req() request: Request,
    @Param('id') id: number,
    @UploadedFile() image: Express.Multer.File,
  ) {
    // TODO: Upload file to CDN
    if (image) {
      console.log(`Image uploaded: ${image.originalname}`);
      return 'Image has received';
    }

    return 'No image';
  }

  @Put('/another-point/update/:id')
  async update(
    @Req() request: Request,
    @Param('id') id: number,
    @Body() updateAnotherPoint: UpdateAnothePoint,
  ) {
    try {
      const token = request.headers.authorization?.split(' ')[1] ?? [];

      return await this.anotherPointService.update(
        token,
        +id,
        updateAnotherPoint,
      );
    } catch (error) {
      throw error;
    }
  }

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
