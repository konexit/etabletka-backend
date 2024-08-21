import {
  HttpException,
  HttpStatus,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { Store } from './entities/store.entity';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateStoreDto } from './dto/update-store.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('stores')
@Controller('api/v1')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post('/store/update/:id/image')
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

  @Patch('/store/update/:id')
  async update(
    @Req() request: Request,
    @Param('id') id: number,
    @Body() updateStore: UpdateStoreDto,
  ) {
    try {
      if (updateStore.name && typeof updateStore.name === 'string') {
        try {
          updateStore.name = JSON.parse(updateStore.name);
        } catch (error) {
          throw new HttpException(
            'Invalid JSON format in "name" property',
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      const token = request.headers.authorization?.split(' ')[1] ?? '';

      return await this.storeService.update(token, +id, updateStore);
    } catch (error) {
      throw error;
    }
  }

  @Post('/store/:id/status')
  async setStoreStatus(
    @Param('id') id: number,
    @Req() request: Request,
  ): Promise<Store> {
    const token = request.headers.authorization?.split(' ')[1] ?? '';
    return await this.storeService.setStoreStatus(token, +id);
  }

  @Get('/stores/all')
  async getActiveStores(
    @Req() request: Request,
    @Query('pagination') pagination?: any,
    @Query('orderBy') orderBy?: any,
    @Query('where') where?: any,
  ): Promise<Store[]> {
    const token = request.headers.authorization?.split(' ')[1] ?? '';
    return await this.storeService.getActiveStores(
      token,
      pagination,
      orderBy,
      where,
    );
  }

  @Get('/stores/city/:cityId')
  async getStoresByCityId(@Param('cityId') cityId: number): Promise<Store[]> {
    return await this.storeService.getStoresByCityId(cityId);
  }

  @Get('/store/:id')
  async getStoreById(
    @Req() request: Request,
    @Param('id') id: number,
  ): Promise<Store> {
    const token = request.headers.authorization?.split(' ')[1] ?? '';
    return await this.storeService.getStoreById(token, +id);
  }
}
