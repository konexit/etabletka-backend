import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderStatus } from './entities/order-status.entity';
import { OrderStatusDescription } from './entities/order-statuses-description.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Order, OrderStatus, OrderStatusDescription])],
    providers: [OrderService],
})
export class OrderModule { }
