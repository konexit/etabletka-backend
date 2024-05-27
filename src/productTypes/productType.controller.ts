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

@Controller()
export class ProductTypeController {
  constructor(private readonly productTypeService: ProductTypeService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  findAll() {
    return this.productTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productTypeService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.productTypeService.remove(id);
  }
}
