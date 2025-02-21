import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderStatus } from './entities/order-status.entity';
import { OrderStatusDescription } from './entities/order-statuses-description.entity';
import { OrderController } from './order.controller';
import { Product } from 'src/products/product/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderStatus, OrderStatusDescription, Product]),
  ],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
