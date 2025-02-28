import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { OrderCart } from '../order/entities/order-cart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderCart]),],
  providers: [CartService],
  controllers: [CartController]
})
export class CartModule { }
