import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Req,
  UseGuards,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';
import { CreateProduct } from './dto/create-product.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateProduct } from './dto/update-product.dto';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('products')
@Controller('api/v1')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('product/create')
  async create(@Body() createProductDto: CreateProduct): Promise<Product> {
    return await this.productService.create(createProductDto);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('/product/:id')
  update(
    @Req() request: Request,
    @Param('id') id: number,
    @Body() updateProduct: UpdateProduct,
  ) {
    const token = request.headers.authorization?.split(' ')[1] ?? '';

    if (updateProduct.name && typeof updateProduct.name === 'string') {
      try {
        updateProduct.name = JSON.parse(updateProduct.name);
      } catch (error) {
        throw new HttpException(
          'Invalid JSON format in "name" property',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (
      updateProduct.shortName &&
      typeof updateProduct.shortName === 'string'
    ) {
      try {
        updateProduct.shortName = JSON.parse(updateProduct.shortName);
      } catch (error) {
        throw new HttpException(
          'Invalid JSON format in "shortName" property',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (updateProduct.seoH1 && typeof updateProduct.seoH1 === 'string') {
      try {
        updateProduct.seoH1 = JSON.parse(updateProduct.seoH1);
      } catch (error) {
        throw new HttpException(
          'Invalid JSON format in "seoH1" property',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (updateProduct.seoTitle && typeof updateProduct.seoTitle === 'string') {
      try {
        updateProduct.seoTitle = JSON.parse(updateProduct.seoTitle);
      } catch (error) {
        throw new HttpException(
          'Invalid JSON format in "seoTitle" property',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (
      updateProduct.seoDescription &&
      typeof updateProduct.seoDescription === 'string'
    ) {
      try {
        updateProduct.seoDescription = JSON.parse(updateProduct.seoDescription);
      } catch (error) {
        throw new HttpException(
          'Invalid JSON format in "seoDescription" property',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    try {
      return this.productService.update(token, id, updateProduct);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Delete('/product/:id')
  remove(@Param('id') id: number) {
    return this.productService.remove(id);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/product/:id/add/badge/:badgeId')
  async addBadgeToProduct(
    @Req() request: Request,
    @Param('id') id: number,
    @Param('badgeId') badgeId: number,
  ): Promise<any> {
    const token = request.headers.authorization?.split(' ')[1] ?? '';

    return await this.productService.addBadgeToProduct(token, id, badgeId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/product/:id')
  async findProductById(@Req() request: Request, @Param('id') id: number) {
    const token = request.headers.authorization?.split(' ')[1] ?? '';
    return await this.productService.findProductById(token, +id, {
      lang: 'uk',
      typeViews: 'object',
    });
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/category/:id/products')
  async getProductsByCategoryId(@Param('id') id: number): Promise<any> {
    return await this.productService.getProductsByCategoryId(+id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/product/slug/:slug')
  async getProductBySlug(@Param('slug') slug: string) {
    return await this.productService.findProductBySlug(slug);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/products')
  async findAll(
    @Req() request: Request,
    @Query('pagination') pagination?: any,
    @Query('orderBy') orderBy?: any,
    @Query('where') where?: any,
  ) {
    const token = request.headers.authorization?.split(' ')[1] ?? '';
    return this.productService.findAll(token, pagination, orderBy, where);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/sale-products')
  async findAllSales() {
    return this.productService.findAllSales();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/popular-products')
  async findPopular() {
    return this.productService.findPopular();
  }
}
