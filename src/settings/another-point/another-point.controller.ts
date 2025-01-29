import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Body,
  UseInterceptors,
  UploadedFile,
  ClassSerializerInterceptor,
  Delete, UseGuards
} from "@nestjs/common";
import { AnotherPointService } from './another-point.service';
import { AnotherPoint } from './entities/another-point.entity';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateAnotherPoint } from './dto/create-another-point.dto';
import { UpdateAnotherPoint } from './dto/update-another-point.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from "src/auth/auth.guard";

@ApiTags('another-point')
@Controller('api/v1')
export class AnotherPointController {
  constructor(private readonly anotherPointService: AnotherPointService) {}

  @UseGuards(AuthGuard)
  @Post('/another-point/create')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(FileInterceptor('image', {}))
  async create(
    @Req() request: Request,
    @UploadedFile() image: Express.Multer.File,
    @Body() createAnotherPoint: CreateAnotherPoint,
  ) {
    const token = request.headers.authorization?.split(' ')[1] ?? '';
    const anotherPoint = await this.anotherPointService.create(
      token,
      createAnotherPoint,
    );

    if (image) {
      // TODO: add image to CDN and fill cdnData, get new data for entity
      console.log(`Image uploaded: ${image.originalname}`);
    }

    return anotherPoint;
  }

  @UseGuards(AuthGuard)
  @Patch('/another-point/update/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Req() request: Request,
    @Param('id') id: number,
    @Body() updateAnotherPoint: UpdateAnotherPoint,
  ) {
    try {
      const token = request.headers.authorization?.split(' ')[1] ?? '';

      return await this.anotherPointService.update(
        token,
        +id,
        updateAnotherPoint,
      );
    } catch (e) {
      throw e;
    }
  }

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
  @Delete('/another-point/:id')
  async delete(@Req() request: Request, @Param('id') id: number) {
    const token = request.headers.authorization?.split(' ')[1] ?? '';
    try {
      return await this.anotherPointService.delete(token, id);
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

  @UseGuards(AuthGuard)
  @Post('/markers/another-point/:id/status')
  async setUseIcon(
    @Req() request: Request,
    @Param('id') id: number,
  ): Promise<AnotherPoint> {
    const token = request.headers.authorization?.split(' ')[1] ?? '';
    return await this.anotherPointService.setUseIcon(token, id);
  }
}
