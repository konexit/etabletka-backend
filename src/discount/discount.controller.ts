import {
  Body,
  ClassSerializerInterceptor,
  Controller, Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile, UseGuards,
  UseInterceptors
} from "@nestjs/common";
import slugify from 'slugify';
import { DiscountService } from './discount.service';
import { CreateDiscount } from './dto/create-discount.dto';
import { Request } from 'express';
import { Discount } from './entities/discount.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateDiscount } from './dto/update-discount.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from "../auth/auth.guard";

@ApiTags('discounts')
@Controller('api/v1')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @UseGuards(AuthGuard)
  @Post('/discount/create')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(FileInterceptor('image', {}))
  async create(
    @Req() request: Request,
    @UploadedFile() image: Express.Multer.File,
    @Body() createDiscount: CreateDiscount,
  ) {
    const token = request.headers.authorization?.split(' ')[1] ?? '';
    try {
      if (createDiscount.name && typeof createDiscount.name === 'string') {
        try {
          createDiscount.name = JSON.parse(createDiscount.name);
        } catch (error) {
          throw new HttpException(
            'Invalid JSON format in "name" property',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      if (!createDiscount.slug)
        createDiscount.slug = slugify(createDiscount.name['uk']);

      if (
        createDiscount.isActive &&
        typeof createDiscount.isActive === 'string'
      ) {
        createDiscount.isActive = createDiscount.isActive === 'true';
      }

      if (createDiscount.type && typeof createDiscount.type === 'string') {
        createDiscount.type = +createDiscount.type;
      }

      if (createDiscount.value && typeof createDiscount.value === 'string') {
        createDiscount.value = +createDiscount.value;
      }

      if (image) {
        // TODO: add image to CDN and fill cdnData, get new data for entity
        console.log(`Image uploaded: ${image.originalname}`);
      }

      return await this.discountService.create(token, createDiscount);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Patch('/discount/update/:id')
  async update(
    @Req() request: Request,
    @Param('id') id: number,
    @Body() updateDiscount: UpdateDiscount,
  ) {
    const token = request.headers.authorization?.split(' ')[1] ?? '';

    try {
      if (updateDiscount.name && typeof updateDiscount.name === 'string') {
        try {
          updateDiscount.name = JSON.parse(updateDiscount.name);
        } catch (error) {
          throw new HttpException(
            'Invalid JSON format in "name" property',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      if (!updateDiscount.slug && updateDiscount.name)
        updateDiscount.slug = slugify(updateDiscount.name['uk']);

      if (
        updateDiscount.isActive &&
        typeof updateDiscount.isActive === 'string'
      ) {
        updateDiscount.isActive = updateDiscount.isActive === 'true';
      }

      if (updateDiscount.type && typeof updateDiscount.type === 'string') {
        updateDiscount.type = +updateDiscount.type;
      }

      if (updateDiscount.value && typeof updateDiscount.value === 'string') {
        updateDiscount.value = +updateDiscount.value;
      }

      return await this.discountService.update(token, +id, updateDiscount);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Delete('/discount/:id')
  async delete(@Req() request: Request, @Param('id') id: number) {
    const token = request.headers.authorization?.split(' ')[1] ?? '';
    try {
      return await this.discountService.delete(token, id);
    } catch (error) {
      throw error;
    }
  }

  @Post('/discount/update/:id/image')
  @UseInterceptors(FileInterceptor('image', {}))
  async updateImage(
    @Req() request: Request,
    @Param('id') id: number,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const token = request.headers.authorization?.split(' ')[1] ?? '';

    // TODO: Upload file to CDN
    if (image) {
      console.log(`Image uploaded: ${image.originalname}`);
      return 'Image has received';
    }

    return 'No image';
  }

  @Post('/discount/:id/status')
  async setStatus(
    @Param('id') id: number,
    @Req() request: Request,
  ): Promise<Discount> {
    const token = request.headers.authorization?.split(' ')[1] ?? '';
    return await this.discountService.setStatus(token, +id);
  }

  @Get('/discounts')
  async getAllDiscounts(@Req() request: Request): Promise<Discount[]> {
    const token = request.headers.authorization?.split(' ')[1] ?? '';
    return await this.discountService.getAllDiscounts(token);
  }

  @Get('/discount/:id')
  async getDiscountById(@Req() request: Request, @Param('id') id: number) {
    const token = request.headers.authorization?.split(' ')[1] ?? '';
    return await this.discountService.getDiscountById(token, +id);
  }
}
