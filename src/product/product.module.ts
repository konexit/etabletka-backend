import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { Badge } from '../badge/entities/badge.entity';
import { Category } from '../categories/entities/category.entity';
import { Discount } from '../discount/entities/discount.entity';
import { ProductGroup } from '../productGroup/entities/product-group.entity';
import { ProductRemnant } from '../productRemnants/entities/product-remnant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Badge,
      Category,
      Discount,
      ProductGroup,
      ProductRemnant,
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService, ProductModule],
})
export class ProductModule {}
