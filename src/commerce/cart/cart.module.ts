import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { OrderCart } from '../order/entities/order-cart.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([OrderCart]),],
  providers: [CartService],
  controllers: [CartController],
  exports: [CartService]
})
export class CartModule { }
