import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discount } from './entities/discount.entity';
import { DiscountController } from './discount.controller';
import { DiscountService } from './discount.service';
import { DiscountGroup } from '../discount-group/entities/discount-group.entity';
import { Product } from 'src/products/product/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Discount, DiscountGroup, Product])],
  controllers: [DiscountController],
  providers: [DiscountService],
  exports: [DiscountService, DiscountModule],
})
export class DiscountModule {}
