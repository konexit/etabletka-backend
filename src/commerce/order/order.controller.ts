import type {
  JwtCheckoutResponse,
  JwtPayload,
} from 'src/common/types/jwt/jwt.interfaces';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
  ParseIntPipe
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import {
  ORDER_ASYNC_SENDER_SCHEDULER,
  ORDER_ASYNC_SENDER_SCHEDULER_ENABLED,
  ORDER_STATE_RECEIVER_SCHEDULER,
  ORDER_STATUS_DESCRIPTION_SCHEDULER,
  ORDER_STATUS_DESCRIPTION_SCHEDULER_ENABLED,
} from './order.constants';
import { OrderService } from './order.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { JWTPayload } from 'src/common/decorators/jwt-payload';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Order } from './entities/order.entity';
import { CheckoutDto } from './dto/checkout.dto';
import { CancelDto } from './dto/cancel.dto';
import { OrderStatusDescription } from './entities/order-statuses-description.entity';
import { UserIdGuard } from 'src/common/guards/user-id.guard';

@ApiTags('order')
@Controller('api/v1/order')
export class OrderController {
  constructor(
    @Inject(OrderService)
    private readonly orderService: OrderService,
  ) { }

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  async checkout(
    @JWTPayload() jwtPayload: JwtPayload,
    @Body() checkoutDto: CheckoutDto,
  ): Promise<JwtCheckoutResponse> {
    return this.orderService.createOrderFromCart(jwtPayload, checkoutDto);
  }

  @Post('cancel')
  @UseGuards(JwtAuthGuard)
  async cancel(
    @JWTPayload() jwtPayload: JwtPayload,
    @Body() cancelDto: CancelDto
  ): Promise<void> {
    return this.orderService.cancelOrder(jwtPayload, cancelDto);
  }

  @Get('/')
  @UseGuards(JwtAuthGuard, UserIdGuard)
  getOrders(
    @JWTPayload() jwtPayload: JwtPayload,
    @Query() pagination?: PaginationDto,
  ) {
    return this.orderService.getOrders(jwtPayload.userId, pagination);
  }

  @Get('/status/descriptions')
  getOrderStatusDescriptions(
    @Query('type') type?: OrderStatusDescription['type'],
  ) {
    return this.orderService.getOrderStatusDescriptions(type);
  }

  @Get('/:orderId')
  @UseGuards(JwtAuthGuard, UserIdGuard)
  getOrder(
    @Param('orderId', ParseIntPipe) orderId: Order['id'],
    @JWTPayload() jwtPayload: JwtPayload,
  ) {
    return this.orderService.getOrder(jwtPayload.userId, orderId);
  }

  @Get('/:orderId/statuses')
  @UseGuards(JwtAuthGuard, UserIdGuard)
  getOrderStatuses(
    @Param('orderId', ParseIntPipe) orderId: Order['id'],
    @JWTPayload() jwtPayload: JwtPayload,
    @Query() pagination?: PaginationDto,
  ) {
    return this.orderService.getOrderStatuses(
      jwtPayload.userId,
      orderId,
      pagination,
    );
  }

  @Cron(process.env[ORDER_ASYNC_SENDER_SCHEDULER] || '0 * * * * *', {
    name: 'asynchronously sending order to trade',
    waitForCompletion: true,
    disabled: !JSON.parse(
      process.env[ORDER_ASYNC_SENDER_SCHEDULER_ENABLED] || 'true',
    ),
  })
  async processOrders(): Promise<void> {
    await this.orderService.processOrders();
  }

  @Cron(process.env[ORDER_STATE_RECEIVER_SCHEDULER] || '*/15 * * * * *', {
    name: 'asynchronously receiving order state from trading',
    waitForCompletion: true,
    disabled: !JSON.parse(
      process.env[ORDER_ASYNC_SENDER_SCHEDULER_ENABLED] || 'true',
    ),
  })
  async processStateOrders(): Promise<void> {
    await this.orderService.processStateOrders();
  }

  @Cron(process.env[ORDER_STATUS_DESCRIPTION_SCHEDULER] || '0 0 */6 * * *', {
    name: 'synchronization trade order statuses',
    waitForCompletion: true,
    disabled: !JSON.parse(
      process.env[ORDER_STATUS_DESCRIPTION_SCHEDULER_ENABLED] || 'true',
    ),
  })
  async processOrderStatusDescriptions(): Promise<void> {
    await this.orderService.processOrderStatusDescriptions();
  }
}
