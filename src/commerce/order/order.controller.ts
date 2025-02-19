import type { JwtPayload } from 'src/common/types/jwt/jwt.interfaces';
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
} from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { JWTPayload } from 'src/common/decorators/jwt-payload';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Order } from './entities/order.entity';
import { GetOrdersStatusDto } from './dto/get-orders-status.dto';

@ApiTags('orders')
@Controller('api/v1/orders')
export class OrderController {
  constructor(
    @Inject(OrderService) private readonly orderService: OrderService,
  ) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  getOrders(
    @JWTPayload() jwtPayload: JwtPayload,
    @Query() pagination?: PaginationDto,
  ) {
    if (!jwtPayload.userId) {
      throw new HttpException('User access denied', HttpStatus.FORBIDDEN);
    }

    const cart = this.orderService.getOrders(jwtPayload.userId, pagination);

    return cart;
  }

  @Get('/:orderId/statuses')
  @UseGuards(JwtAuthGuard)
  getOrderStatuses(
    @Param('orderId') orderId: Order['id'],
    @JWTPayload() jwtPayload: JwtPayload,
    @Query() pagination?: PaginationDto,
  ) {
    if (!jwtPayload.userId) {
      throw new HttpException('User access denied', HttpStatus.FORBIDDEN);
    }

    const cart = this.orderService.getOrderStatuses(
      jwtPayload.userId,
      orderId,
      pagination,
    );

    return cart;
  }

  @Post('/status')
  @UseGuards(JwtAuthGuard)
  getOrdersStatus(
    @JWTPayload() jwtPayload: JwtPayload,
    @Body() idsDto: GetOrdersStatusDto,
  ) {
    if (!jwtPayload.userId) {
      throw new HttpException('User access denied', HttpStatus.FORBIDDEN);
    }

    const cart = this.orderService.getOrdersStatus(
      jwtPayload.userId,
      idsDto.ids,
    );

    return cart;
  }
}
