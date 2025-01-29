import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import slugify from 'slugify';
import { ProductGroupService } from './product-group.service';
import { CreateProductGroup } from './dto/create-product-group.dto';
import { Request } from 'express';
import { UpdateProductGroup } from './dto/update-product-group.dto';
import { ProductGroup } from './entities/product-group.entity';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('product-groups')
@Controller('api/v1')
export class ProductGroupController {
  constructor(private readonly productGroupService: ProductGroupService) {}

  @UseGuards(AuthGuard)
  @Post('/product-group/create')
  @UseInterceptors(ClassSerializerInterceptor)
  async create(
    @Req() request: Request,
    @Body() createProductGroup: CreateProductGroup,
  ) {
    console.log('CreateProductGroup', createProductGroup);
    const token = request.headers.authorization?.split(' ')[1] ?? '';

    if (!createProductGroup.slug)
      createProductGroup.slug = slugify(createProductGroup.name);

    if (!createProductGroup.slug)
      createProductGroup.slug = slugify(createProductGroup.name);

    if (
      createProductGroup.parentId &&
      typeof createProductGroup.parentId === 'string'
    )
      createProductGroup.parentId = +createProductGroup.parentId;

    if (createProductGroup.root && typeof createProductGroup.root === 'string')
      createProductGroup.root = createProductGroup.root === 'true';

    return await this.productGroupService.create(token, createProductGroup);
  }

  @UseGuards(AuthGuard)
  @Patch('/product-group/update/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Req() request: Request,
    @Param('id') id: number,
    @Body() updateProductGroup: UpdateProductGroup,
  ) {
    try {
      const token = request.headers.authorization?.split(' ')[1] ?? '';

      if (
        updateProductGroup.root &&
        typeof updateProductGroup.root === 'string'
      )
        updateProductGroup.root = updateProductGroup.root === 'true';

      return await this.productGroupService.update(
        token,
        +id,
        updateProductGroup,
      );
    } catch (error) {
      throw error;
    }
  }

  @Get('/product-groups')
  async getProductGroups() {
    return await this.productGroupService.getProductGroups();
  }

  @Get('/product-group/:id')
  async getProductGroupById(@Param('id') id: number): Promise<ProductGroup> {
    return await this.productGroupService.getProductGroupById(+id);
  }
}
