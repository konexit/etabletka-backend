import {
  ClassSerializerInterceptor,
  Controller,
  Post,
  Body,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { CreateOrder } from './dto/createOrder.dto';
import { CreateOrderItem } from '../orderItem/dto/createOrderItem.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('api/v1/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/create')
  async create(
    @Body() newOrder: CreateOrder,
    @Body() orderItems: CreateOrderItem[],
    @Res() res: any,
  ): Promise<Order> {
    //TODO: it will need to test
    console.log('createOrder', newOrder);
    console.log('createOrderItem', orderItems);
    try {
      const order = await this.orderService.create(newOrder, orderItems);

      if (!order) {
        return res.status(404).json({ message: 'Order does not create' });
      }

      return res.json(order);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error', error: error });
    }
  }
}
