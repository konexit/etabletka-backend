import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductTypeService } from './product-type.service';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('product-types')
@Controller('api/v1')
export class ProductTypeController {
  constructor(private readonly productTypeService: ProductTypeService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/product-types')
  async findAll() {
    return await this.productTypeService.findAll();
  }

  @Get('/product-type/:id')
  async findOne(@Param('id') id: number) {
    return await this.productTypeService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Delete('/product-type/:id')
  async remove(@Param('id') id: number) {
    return await this.productTypeService.remove(id);
  }
}
