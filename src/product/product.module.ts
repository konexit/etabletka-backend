import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { Badge } from '../badge/entities/badge.entity';
import { Discount } from '../discount/entities/discount.entity';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Badge, Discount]),
    CacheModule.register(),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService, ProductModule],
})
export class ProductModule {}
