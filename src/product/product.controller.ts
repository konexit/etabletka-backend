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
  Res,
  UseGuards,
} from '@nestjs/common';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateProductDto } from './dto/update-product.dto';
import { Request } from 'express';

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
  async findOne(@Param('id') id: number) {
    return await this.productService.findProductById(+id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/product/slug/:slug')
  async getProductBySlug(@Param('slug') slug: string) {
    return await this.productService.findProductBySlug(slug);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(@Req() request: Request) {
    const token = request.headers.authorization?.split(' ')[1] ?? [];
    return this.productService.findAll(token);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.productService.remove(id);
  }

  @UseGuards(AuthGuard)
  @Post(':id/add/badge/:badgeId')
  async addBadgeToProduct(
    @Req() request: Request,
    @Param('id') id: number,
    @Param('badgeId') badgeId: number,
    @Res() res: any,
  ): Promise<any> {
    const token = request.headers.authorization?.split(' ')[1] ?? [];
    try {
      const productBadge = await this.productService.addBadgeToProduct(
        token,
        id,
        badgeId,
      );

      if (!productBadge) {
        return res.status(404).json({ message: 'Product not found' });
      }

      return res.json(productBadge);
    } catch (error) {
      return res.status(error.status).json(error);
    }
  }
}
