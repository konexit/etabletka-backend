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
} from '@nestjs/common';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateProductDto } from './dto/update-product.dto';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('products')
@Controller('api/v1')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('product/create')
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return await this.productService.create(createProductDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/product/:id')
  async findProductById(@Req() request: Request, @Param('id') id: number) {
    const token = request.headers.authorization?.split(' ')[1] ?? '';
    return await this.productService.findProductById(token, +id);
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

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('/product/:id')
  update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
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
}
