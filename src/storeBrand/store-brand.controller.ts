import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { StoreBrandService } from './store-brand.service';
import { StoreBrand } from './entities/store-brand.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { CreateStoreBrand } from './dto/create-store-brand.dto';
import { UpdateStoreBrand } from './dto/update-store-brand.dto';

@Controller('api/v1')
export class StoreBrandController {
  constructor(private readonly storeBrandService: StoreBrandService) {}

  @Post('/store/brand/create')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(FileInterceptor('image', {}))
  async create(
    @Req() request: Request,
    @UploadedFile() image: Express.Multer.File,
    @Body() createStoreBrand: CreateStoreBrand,
  ) {
    const token = request.headers.authorization?.split(' ')[1] ?? [];
    const storeBrand = await this.storeBrandService.create(
      token,
      createStoreBrand,
    );

    if (image) {
      // TODO: add image to CDN and fill cdnData, get new data for entity
      console.log(`Image uploaded: ${image.originalname}`);
    }

    return storeBrand;
  }

  @Patch('/store/brand/update/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async updateStoreBrand(
    @Req() request: Request,
    @Param('id') id: number,
    @Body() updateStoreBrand: UpdateStoreBrand,
  ) {
    const token = request.headers.authorization?.split(' ')[1] ?? [];
    return this.storeBrandService.update(token, +id, updateStoreBrand);
  }

  @Delete('/store/brand/:id')
  async delete(@Req() request: Request, @Param('id') id: number) {
    const token = request.headers.authorization?.split(' ')[1] ?? [];
    try {
      return await this.storeBrandService.delete(token, id);
    } catch (error) {
      throw error;
    }
  }

  @Post('/store/brand/update/:id/image')
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

  @Get('/store/brands')
  async getAllStoreBrands(): Promise<StoreBrand[]> {
    return await this.storeBrandService.getAllStoreBrands();
  }

  @Get('/store/brand/:id')
  async getStoreBrandById(@Param('id') id: number): Promise<StoreBrand> {
    return await this.storeBrandService.getStoreBrandById(+id);
  }
}
