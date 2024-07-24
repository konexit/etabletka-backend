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
  UseInterceptors,
} from '@nestjs/common';
import slugify from 'slugify';
import { DiscountService } from './discount.service';
import { CreateDiscount } from './dto/create-discount.dto';
import { Request } from 'express';
import { Discount } from "./entities/discount.entity";

@Controller('api/v1')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post('/discount/create')
  @UseInterceptors(ClassSerializerInterceptor)
  async create(
    @Req() request: Request,
    @Body() createDiscount: CreateDiscount,
  ) {
    const token = request.headers.authorization?.split(' ')[1] ?? [];
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

        if (createDiscount.slug === '') {
          createDiscount.slug = slugify(createDiscount.name['uk']);
        }

        if (
          createDiscount.isActive &&
          typeof createDiscount.isActive === 'string'
        ) {
          createDiscount.isActive = createDiscount.isActive === 'true';
        }

        return await this.discountService.create(token, createDiscount);
      }
    } catch (error) {
      throw error;
    }
  }

  @Patch('/discount/update/:id')
  async update() {
    return 'Updated';
  }

  @Post('/discount/:id/status')
  async setStatus(
    @Param('id') id: number,
    @Req() request: Request,
  ): Promise<Discount> {
    const token = request.headers.authorization?.split(' ')[1] ?? [];
    return await this.discountService.setStatus(token, +id);
  }

  @Get('/discounts')
  async getAllDiscounts(@Req() request: Request): Promise<Discount[]> {
    const token = request.headers.authorization?.split(' ')[1] ?? [];
    return await this.discountService.getAllDiscounts(token);
  }

  @Get('/discount/:id')
  async getDiscountById(@Req() request: Request, @Param('id') id: number) {
    const token = request.headers.authorization?.split(' ')[1] ?? [];
    return await this.discountService.getDiscountById(token, +id);
  }
}
