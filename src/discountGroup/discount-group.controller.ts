import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { DiscountGroupService } from './discount-group.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { CreateDiscountGroup } from './dto/create-discount-group.dto';
import { UpdateDiscountGroup } from './dto/update-discount-group.dto';
import { DiscountGroup } from './entities/discount-group.entity';

@Controller('api/v1')
export class DiscountGroupController {
  constructor(private readonly discountGroupService: DiscountGroupService) {}

  @Post('/discount-group/create')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(FileInterceptor('image', {}))
  async create(
    @Req() request: Request,
    @UploadedFile() image: Express.Multer.File,
    @Body() createDiscountGroup: CreateDiscountGroup,
  ) {
    const token = request.headers.authorization?.split(' ')[1] ?? [];
    try {
      if (
        createDiscountGroup.name &&
        typeof createDiscountGroup.name === 'string'
      ) {
        try {
          createDiscountGroup.name = JSON.parse(createDiscountGroup.name);
        } catch (error) {
          throw new HttpException(
            'Invalid JSON format in "name" property',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      if (
        createDiscountGroup.isActive &&
        typeof createDiscountGroup.isActive === 'string'
      ) {
        createDiscountGroup.isActive = createDiscountGroup.isActive === 'true';
      }

      const discountGroup = await this.discountGroupService.create(
        token,
        createDiscountGroup,
      );

      if (image) {
        // TODO: add image to CDN and fill cdnData, get new data for entity
        console.log(`Image uploaded: ${image.originalname}`);
      }

      return discountGroup;
    } catch (error) {
      throw error;
    }
  }

  @Patch('/discount-group/update/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Req() request: Request,
    @Param('id') id: number,
    @Body() updateDiscountGroup: UpdateDiscountGroup,
  ) {
    const token = request.headers.authorization?.split(' ')[1] ?? [];
    try {
      if (
        updateDiscountGroup.name &&
        typeof updateDiscountGroup.name === 'string'
      ) {
        try {
          updateDiscountGroup.name = JSON.parse(updateDiscountGroup.name);
        } catch (error) {
          throw new HttpException(
            'Invalid JSON format in "name" property',
            HttpStatus.BAD_REQUEST,
          );
        }

        return await this.discountGroupService.update(
          token,
          +id,
          updateDiscountGroup,
        );
      }
    } catch (error) {
      throw error;
    }
  }

  @Post('/discount-group/update/:id/image')
  @UseInterceptors(FileInterceptor('image', {}))
  async updateImage(
    @Req() request: Request,
    @Param('id') id: number,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const token = request.headers.authorization?.split(' ')[1] ?? [];

    // TODO: Upload file to CDN
    if (image) {
      console.log(`Image uploaded: ${image.originalname}`);
      return 'Image has received';
    }

    return 'No image';
  }

  @Post('/discount-group/:id/status')
  async setStatus(
    @Param('id') id: number,
    @Req() request: Request,
  ): Promise<DiscountGroup> {
    const token = request.headers.authorization?.split(' ')[1] ?? [];
    return await this.discountGroupService.setStatus(token, +id);
  }

  @Get('/discount-groups')
  async getAllDiscountGroups(
    @Req() request: Request,
  ): Promise<DiscountGroup[]> {
    const token = request.headers.authorization?.split(' ')[1] ?? [];
    return await this.discountGroupService.getAllDiscountGroups(token);
  }

  @Get('/discount-group/:id')
  async getDiscountGroupById(
    @Req() request: Request,
    @Param('id') id: number,
  ): Promise<DiscountGroup> {
    const token = request.headers.authorization?.split(' ')[1] ?? [];
    return await this.discountGroupService.getDiscountGroupById(token, +id);
  }
}
