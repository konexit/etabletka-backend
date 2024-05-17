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
} from '@nestjs/common';
import ProductRemnant from './entities/productRemnant.entity';
import { ProductRemnantService } from './productRemnant.service';
import CreateProductRemnantDto from './dto/create-product-remnant.dto';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateProductDto } from '../product/dto/update-product.dto';

@Controller()
export class ProductRemnantController {
  constructor(private readonly productRemnantService: ProductRemnantService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  create(
    @Body() createProductRemnantDto: CreateProductRemnantDto,
  ): Promise<ProductRemnant> {
    return this.productRemnantService.create(createProductRemnantDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  findAll() {
    return this.productRemnantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productRemnantService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productRemnantService.update(id, updateProductDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.productRemnantService.remove(id);
  }
}
