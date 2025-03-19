import type { JwtCheckoutResponse, JwtPayload } from 'src/common/types/jwt/jwt.interfaces';
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
import { GetByOrderIdsDto } from './dto/get-by-order-ids.dto';
import { CheckoutDto } from './dto/checkout.dto';
import { CancelDto } from './dto/cancel.dto';

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
    @Body() checkoutDto: CheckoutDto
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

    return this.orderService.getOrderStatuses(
      jwtPayload.userId,
      orderId,
      pagination,
    );
  }

  @Post('/status')
  @UseGuards(JwtAuthGuard)
  getOrdersStatus(
    @JWTPayload() jwtPayload: JwtPayload,
    @Body() idsDto: GetByOrderIdsDto,
  ) {
    if (!jwtPayload.userId) {
      throw new HttpException('User access denied', HttpStatus.FORBIDDEN);
    }

    const statuses = this.orderService.getOrdersStatus(
      jwtPayload.userId,
      idsDto.ids,
    );

    return statuses;
  }

  @Post('/products')
  @UseGuards(JwtAuthGuard)
  getOrdersProducts(
    @JWTPayload() jwtPayload: JwtPayload,
    @Body() idsDto: GetByOrderIdsDto,
  ) {
    if (!jwtPayload.userId) {
      throw new HttpException('User access denied', HttpStatus.FORBIDDEN);
    }

    return this.orderService.getOrdersProducts(
      jwtPayload.userId,
      idsDto.ids,
    );
  }
}
