import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { JWTPayload } from 'src/common/decorators/jwt-payload';
import type { JwtPayload } from 'src/common/types/jwt/jwt.interfaces';
import type { PaginationDto } from 'src/common/dto/pagination.dto';

@ApiTags('order')
@Controller('api/v1/order')
export class OrderController {
  constructor(
    @Inject(OrderService) private readonly orderService: OrderService,
  ) {}

  @Get('/list')
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
}
