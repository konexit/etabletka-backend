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

@Controller('api/v1/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.create(createProductDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res) {
    try {
      const product = await this.productService.findProductById(+id);

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      return res.json(product);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  @Post(':slug')
  async getProductBySlug(@Param('slug') slug: string, @Res() res) {
    try {
      const product = await this.productService.findProductBySlug(slug);

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      return res.json(product);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
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
    @Res() res,
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
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
