import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductGroup } from './entities/product-group.entity';
import { Product } from '../product/entities/product.entity';
import { ProductGroupController } from './product-group.controller';
import { ProductGroupService } from './product-group.service';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductGroup, Product]),
    CategoriesModule
  ],
  controllers: [ProductGroupController],
  providers: [ProductGroupService],
  exports: [ProductGroupService, ProductGroupModule],
})
export class ProductGroupModule { }
