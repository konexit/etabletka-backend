import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductGroupService } from './product-group.service';
import { CreateProductGroupDto } from './dto/create-product-group.dto';
import { UpdateProductGroupDto } from './dto/update-product-group.dto';
import { ProductGroup } from './entities/product-group.entity';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { USER_ROLE_JWT_ADMIN } from 'src/user/user.constants';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ProductGroupPage } from './product-group.interface';

@ApiTags('product-groups')
@Controller('api/v1')
export class ProductGroupController {
  constructor(private readonly productGroupService: ProductGroupService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLE_JWT_ADMIN)
  @Post('/product-group')
  @UseInterceptors(ClassSerializerInterceptor)
  async createProductGroup(@Body() createProductGroupDto: CreateProductGroupDto): Promise<ProductGroup> {
    return this.productGroupService.createProductGroup(createProductGroupDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLE_JWT_ADMIN)
  @Patch('/product-group/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async patchProductGroup(
    @Param('id', ParseIntPipe) id: ProductGroup['id'],
    @Body() updateProductGroupDto: UpdateProductGroupDto,
  ): Promise<ProductGroup> {
    return this.productGroupService.patchProductGroup(id, updateProductGroupDto)
  }

  @Get('/product-groups')
  async findAll(): Promise<ProductGroup[]> {
    return this.productGroupService.findAll();
  }

  @Get('/product-groups/:slug')
  async getProductGroupBySlug(@Param('slug') slug: ProductGroup['slug']): Promise<ProductGroupPage> {
    return this.productGroupService.getProductGroupBySlug(slug);
  }
}
