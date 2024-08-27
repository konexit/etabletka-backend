import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProductRemnant } from './entities/product-remnant.entity';
import { ProductRemnantService } from './product-remnant.service';
import { CreateProductRemnant } from './dto/create-product-remnant.dto';
import { UpdateProductRemnant } from './dto/update-product-remnant.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('remnants')
@Controller('api/v1/remnants')
export class ProductRemnantController {
  constructor(private readonly productRemnantService: ProductRemnantService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  create(
    @Body() createProductRemnant: CreateProductRemnant,
  ): Promise<ProductRemnant> {
    return this.productRemnantService.create(createProductRemnant);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateProductRemnant: UpdateProductRemnant,
  ) {
    return this.productRemnantService.update(id, updateProductRemnant);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.productRemnantService.remove(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  findAll(@Req() request: Request) {
    const token = request.headers.authorization?.split(' ')[1] ?? '';
    return this.productRemnantService.findAll(token);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productRemnantService.findOne(+id);
  }

  @Get('/product/:productId/store/:storeId')
  async getProductRemnantsInStore(
    @Param('productId') productId: number,
    @Param('storeId') storeId: number,
  ): Promise<any> {
    return await this.productRemnantService.findProductRemnantsInStore(
      productId,
      storeId,
    );
  }

  @Get('/product/:productId/city/:cityId')
  async getProductRemnantsInCity(
    @Param('productId') productId: number,
    @Param('cityId') cityId: number,
  ): Promise<any> {
    return await this.productRemnantService.findProductRemnantsInCity(
      productId,
      cityId,
    );
  }
}
