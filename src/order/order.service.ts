import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateOrder } from './dto/createOrder.dto';
import { CreateOrderItem } from '../orderItem/dto/create-order-item.dto';
import { OrderItem } from '../orderItem/entities/order-item.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Order)
    private orderItemRepository: Repository<OrderItem>,
    private jwtService: JwtService,
  ) {}

  async create(
    newOrder: CreateOrder,
    createOrderItem: CreateOrderItem[],
  ): Promise<Order> {
    const order = await this.orderRepository.save(newOrder);

    if (!order) {
      throw new HttpException('Can`t create order', HttpStatus.NOT_FOUND);
    }

    for (const orderItem of createOrderItem) {
      orderItem.orderId = order.id;
      await this.orderItemRepository.save(createOrderItem);
    }

    return order;
  }
}
