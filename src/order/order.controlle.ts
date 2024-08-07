import {
  ClassSerializerInterceptor,
  Controller,
  Post,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { CreateOrder } from './dto/create-order.dto';
import { CreateOrderItem } from '../orderItem/dto/create-order-item.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('order')
@Controller('api/v1/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/create')
  async create(
    @Body() newOrder: CreateOrder,
    @Body() orderItems: CreateOrderItem[],
  ): Promise<Order> {
    //TODO: it will need to test
    console.log('createOrder', newOrder);
    console.log('createOrderItem', orderItems);

    return await this.orderService.create(newOrder, orderItems);
  }
}
