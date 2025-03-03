import {
  Controller,
  Param,
  Patch,
  Post,
  Get,
  Delete,
  Body,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  ParseIntPipe
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtCartResponse, JwtPayload, JwtResponse } from 'src/common/types/jwt/jwt.interfaces';
import { JWTPayload } from 'src/common/decorators/jwt-payload';
import { OptionalJwtAuthGuard } from 'src/auth/jwt/optional-jwt-auth.guard';
import { CartCreateDto } from './dto/cart-create.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { OrderCart } from '../order/entities/order-cart.entity';
import { CartUpdateDto } from './dto/cart-update.dto';

@Controller('api/v1/cart')
export class CartController {
  constructor(
    private readonly cartService: CartService,
  ) { }

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  createCart(
    @JWTPayload() jwtPayload: JwtPayload,
    @Body() cartCreateDto: CartCreateDto,
  ): Promise<JwtCartResponse> {
    return this.cartService.createCart(jwtPayload, cartCreateDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  getCarts(
    @JWTPayload() jwtPayload: JwtPayload
  ): Promise<OrderCart[]> {
    return this.cartService.getCarts(jwtPayload);
  }

  @Get(':cartId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  getCart(
    @JWTPayload() jwtPayload: JwtPayload,
    @Param('cartId', ParseIntPipe) cartId: number,
  ): Promise<OrderCart> {
    return this.cartService.getCart(jwtPayload, cartId);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  patchCart(
    @JWTPayload() jwtPayload: JwtPayload,
    @Body() cartUpdateDto: CartUpdateDto,
  ): Promise<OrderCart> {
    return this.cartService.patchCart(jwtPayload, cartUpdateDto);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  deleteCart(
    @JWTPayload() jwtPayload: JwtPayload,
    @Body() cartUpdateDto: CartUpdateDto,
  ): Promise<JwtResponse> {
    return this.cartService.deleteCart(jwtPayload, cartUpdateDto.cartId);
  }
}
