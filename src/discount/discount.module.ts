import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discount } from './entities/discount.entity';
import { DiscountController } from './discount.controller';
import { DiscountService } from './discount.service';
import { DiscountGroup } from '../discountGroup/entities/discount-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Discount, DiscountGroup])],
  controllers: [DiscountController],
  providers: [DiscountService],
  exports: [DiscountService, DiscountModule],
})
export class DiscountModule {}
