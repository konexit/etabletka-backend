import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductTypeService } from './productType.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api/v1/product-types')
export class ProductTypeController {
  constructor(private readonly productTypeService: ProductTypeService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll() {
    return await this.productTypeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.productTypeService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.productTypeService.remove(id);
  }
}
