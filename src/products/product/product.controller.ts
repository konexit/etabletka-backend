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
  ParseIntPipe,
} from '@nestjs/common';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';
import { CreateProduct } from './dto/create-product.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateProduct } from './dto/update-product.dto';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { OptionalJwtAuthGuard } from 'src/auth/jwt/optional-jwt-auth.guard';
import { JWTPayload } from 'src/common/decorators/jwt-payload';
import { JwtPayload } from 'src/common/types/jwt/jwt.interfaces';
import { GetByProductIdsDto } from './dto/get-by-product-ids.dto';
import { TransformAttributesViews } from 'src/common/decorators/transform-attributes';

@ApiTags('products')
@Controller('api/v1')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard)
  @Post('product/create')
  async create(@Body() createProductDto: CreateProduct): Promise<Product> {
    return this.productService.create(createProductDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard)
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

    return this.productService.update(token, id, updateProduct);
  }

  @Delete('/product/:id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: number) {
    return this.productService.remove(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard)
  @Post('/product/:id/add/badge/:badgeId')
  async addBadgeToProduct(
    @Req() request: Request,
    @Param('id') id: number,
    @Param('badgeId') badgeId: number,
  ) {
    const token = request.headers.authorization?.split(' ')[1] ?? '';
    return this.productService.addBadgeToProduct(token, id, badgeId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/product/ids')
  async findProductByIds(
    @Body() getByProductIdsDto: GetByProductIdsDto,
  ): Promise<Product[]> {
    return this.productService.findProductByIds(getByProductIdsDto.ids, {
      lang: 'uk',
      typeViews: TransformAttributesViews.Object,
    });
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/product/discount')
  async findDiscountProducts() {
    return this.productService.findDiscountProducts();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/product/popular')
  async findPopularProducts() {
    return this.productService.findPopularProducts();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(OptionalJwtAuthGuard)
  @Get('/product/:id')
  async findProductById(
    @JWTPayload() jwtPayload: JwtPayload,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Product> {
    return this.productService.findProductById(jwtPayload, id, {
      lang: 'uk',
      typeViews: TransformAttributesViews.Object,
    });
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/category/:id/products')
  async getProductsByCategoryId(@Param('id') id: number) {
    return this.productService.getProductsByCategoryId(+id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/product/slug/:slug')
  async getProductBySlug(@Param('slug') slug: string) {
    return this.productService.findProductBySlug(slug);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/products')
  async findAll(
    @Req() request: Request,
    @Query('pagination') pagination,
    @Query('orderBy') orderBy,
    @Query('where') where,
  ) {
    const token = request.headers.authorization?.split(' ')[1] ?? '';
    return this.productService.findAll(token, pagination, orderBy, where);
  }
}
