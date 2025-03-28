import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { OrderCart } from '../order/entities/order-cart.entity';
import { JwtTokenService } from 'src/auth/jwt/jwt-token.service';
import { JwtCartResponse, JwtPayload, JwtResponse } from 'src/common/types/jwt/jwt.interfaces';
import { CartCreateDto } from './dto/cart-create.dto';
import { CartUpdateDto } from './dto/cart-update.dto';
import { COMPANY_ETABLETKA_ID, OrderTypes } from 'src/common/config/common.constants';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(OrderCart)
    private readonly orderCartRepository: Repository<OrderCart>,
    private readonly jwtTokenService: JwtTokenService
  ) { }

  async createCart(payload: JwtPayload, cartCreateDto: CartCreateDto): Promise<JwtCartResponse> {
    const jwtPayload = this.jwtTokenService.ensureJwtPayload(payload);

    const cart = this.orderCartRepository.create({
      userId: jwtPayload.userId ?? null,
      orderTypeId: cartCreateDto.orderTypeId ?? OrderTypes.Common,
      storeId: cartCreateDto.storeId ?? null,
      companyId: cartCreateDto.companyId ?? COMPANY_ETABLETKA_ID,
      katottgId: cartCreateDto.katottgId ?? null,
      order: cartCreateDto.order ?? { items: [] },
    });

    const { id } = await this.orderCartRepository.save(cart);
    const token = await this.jwtTokenService.generateToken(
      this.jwtTokenService.addCartsToJwt(jwtPayload, [id]),
      true
    );

    return { ...token, cartId: id };
  }

  async patchCart(payload: JwtPayload, cartUpdateDto: CartUpdateDto): Promise<OrderCart> {
    this.jwtTokenService.validateCartAccess(payload, cartUpdateDto.cartId);

    const orderCart = await this.orderCartRepository.findOne({ where: { id: cartUpdateDto.cartId } });
    if (!orderCart) {
      throw new HttpException(`Cart id: ${cartUpdateDto.cartId} not found`, HttpStatus.NOT_FOUND);
    }

    this.orderCartRepository.merge(orderCart, cartUpdateDto);
    return this.orderCartRepository.save(orderCart);
  }

  async getCart(payload: JwtPayload, cartId: number): Promise<OrderCart> {
    this.jwtTokenService.validateCartAccess(payload, cartId);
    return this.orderCartRepository.findOne({ where: { id: cartId } });
  }

  async getCarts(payload: JwtPayload): Promise<OrderCart[]> {
    if (!payload.carts?.length) {
      throw new HttpException('Carts not found', HttpStatus.NOT_FOUND);
    }
    return this.orderCartRepository.find({ where: { id: In(payload.carts) }, order: { id: 'ASC' } });
  }

  async deleteCart(payload: JwtPayload, cartId: number): Promise<JwtResponse> {
    this.jwtTokenService.validateCartAccess(payload, cartId);

    const result = await this.orderCartRepository.delete(cartId);
    if (!result.affected) {
      throw new HttpException(`Cart id: ${cartId} not found`, HttpStatus.NOT_FOUND);
    }

    const jwtPayload = this.jwtTokenService.removeCartsFromJwt(payload, [cartId]);
    return this.jwtTokenService.generateToken(
      jwtPayload,
      !!jwtPayload.carts.length
    );
  }

  async associateCartsWithUser(payload: JwtPayload, userId: number): Promise<number[]> {
    if (payload?.carts?.length) {
      await this.orderCartRepository.update({ id: In(payload.carts) }, { userId });
    }

    const userCarts = await this.orderCartRepository.find({ where: { userId }, select: ['id'] });

    return userCarts.map(cart => cart.id);
  }
}