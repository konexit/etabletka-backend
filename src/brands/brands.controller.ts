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
} from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';

@Controller('api/v1')
@UseInterceptors(ClassSerializerInterceptor)
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) { }

  @Post('/brand')
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto);
  }

  @Get('/brands')
  async findAll(): Promise<Brand[]> {
    return await this.brandsService.findAll();
  }

  @Get('/brand/:id')
  async findOne(@Param('id') id: string): Promise<Brand> {
    return await this.brandsService.findOne(+id);
  }

  @Patch('/brand/:id')
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandsService.update(+id, updateBrandDto);
  }

  @Delete('/brand/:id')
  remove(@Param('id') id: string) {
    return this.brandsService.remove(+id);
  }
}
