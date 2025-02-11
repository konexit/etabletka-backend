import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderStatus } from './entities/order-status.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Order, OrderStatus])],
    providers: [OrderService],
})
export class OrderModule { }
