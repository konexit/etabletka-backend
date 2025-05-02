import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors
} from '@nestjs/common';
import { ProductAttributesService } from './product-attributes.service';
import { CreateProductAttributesDto } from './dto/create-product-attributes.dto';
import { UpdateProductAttributesDto } from './dto/update-product-attributes.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('product-attributes')
@Controller('api/v1/product-attributes')
export class ProductAttributesController {
  constructor(private readonly productAttributesService: ProductAttributesService) { }

  @Get()
  async getAll() {
    return this.productAttributesService.findAll();
  }

  @Get('/:id')
  async findById(
    @Param('id') id: number
  ) {
    return this.productAttributesService.findById(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() createProductAttributesDto: CreateProductAttributesDto) {
    return this.productAttributesService.create(createProductAttributesDto);
  }

  // @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('/:id')
  update(
    @Param('id') id: number,
    @Body() updateProductAttributes: UpdateProductAttributesDto,
  ) {
    return this.productAttributesService.update(id, updateProductAttributes);
  }

  // @UseGuards(AuthGuard)
  @Delete('/:id')
  remove(@Param('id') id: number) {
    return this.productAttributesService.remove(id);
  }
}
