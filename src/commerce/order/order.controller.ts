import type {
  JwtCheckoutResponse,
  JwtPayload,
} from 'src/common/types/jwt/jwt.interfaces';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
  ParseIntPipe
} from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { JWTPayload } from 'src/common/decorators/jwt-payload';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Order } from './entities/order.entity';
import { CheckoutDto } from './dto/checkout.dto';
import { CancelDto } from './dto/cancel.dto';
import { OrderStatusDescription } from './entities/order-statuses-description.entity';

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
  @UseGuards(JwtAuthGuard)
  getOrders(
    @JWTPayload() jwtPayload: JwtPayload,
    @Query() pagination?: PaginationDto,
  ) {
    if (!jwtPayload.userId) {
      throw new HttpException('User access denied', HttpStatus.FORBIDDEN);
    }

    return this.orderService.getOrders(jwtPayload.userId, pagination);
  }

  @Get('/status/descriptions')
  getOrderStatusDescriptions(
    @Query('type') type?: OrderStatusDescription['type'],
  ) {
    return this.orderService.getOrderStatusDescriptions(type);
  }

  @Get('/:orderId')
  @UseGuards(JwtAuthGuard)
  getOrder(
    @Param('orderId', ParseIntPipe) orderId: Order['id'],
    @JWTPayload() jwtPayload: JwtPayload,
  ) {
    if (!jwtPayload.userId) {
      throw new HttpException('User access denied', HttpStatus.FORBIDDEN);
    }

    return this.orderService.getOrder(jwtPayload.userId, orderId);
  }

  @Get('/:orderId/statuses')
  @UseGuards(JwtAuthGuard)
  getOrderStatuses(
    @Param('orderId', ParseIntPipe) orderId: Order['id'],
    @JWTPayload() jwtPayload: JwtPayload,
    @Query() pagination?: PaginationDto,
  ) {
    if (!jwtPayload.userId) {
      throw new HttpException('User access denied', HttpStatus.FORBIDDEN);
    }

    return this.orderService.getOrderStatuses(
      jwtPayload.userId,
      orderId,
      pagination,
    );
  }
}
