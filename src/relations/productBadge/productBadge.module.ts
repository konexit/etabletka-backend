import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductBadgeService } from './productBadge.service';
import { ProductBadgeController } from './productBadge.controller';
import { ProductBadge } from './entities/productBadge.entity';
import { Product } from '../../product/entities/product.entity';
import { Badge } from '../../badge/entities/badge.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductBadge, Product, Badge])],
  controllers: [ProductBadgeController],
  providers: [ProductBadgeService],
  exports: [ProductBadgeService, ProductBadgeModule],
})
export class ProductBadgeModule {}
