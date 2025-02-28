import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { OrderCart } from '../order/entities/order-cart.entity';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TOKEN_TYPE } from 'src/auth/auth.constants';
import { JwtCartResponse, JwtPayload, JwtResponse } from 'src/common/types/jwt/jwt.interfaces';
import { ROLE_ANONYMOUS } from 'src/users/role/user-role.constants';
import { CartCreateDto } from './dto/cart-create.dto';
import { COMPANY_ETABLETKA_ID, OrderTypes } from 'src/common/config/common.constants';
import { CartUpdateDto } from './dto/cart-update.dto';
import { getJwtExpiresInEnv } from 'src/common/utils/common/jwt';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(OrderCart)
    private orderCartRepository: Repository<OrderCart>,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) { }

  async createCart(payload: JwtPayload, cartCreateDto: CartCreateDto): Promise<JwtCartResponse> {
    const jwtPayload = this.checkEmptyJwtPayload(payload);

    const orderCart = this.orderCartRepository.create({
      userId: jwtPayload.userId ?? null,
      orderTypeId: cartCreateDto.orderTypeId ?? OrderTypes.Common,
      storeId: cartCreateDto.storeId ?? null,
      companyId: cartCreateDto.companyId ?? COMPANY_ETABLETKA_ID,
      cityId: cartCreateDto.cityId ?? null,
      order: {
        items: []
      },
    });

    const { id } = await this.orderCartRepository.save(orderCart);
    const { access_token, token_type, expires_in } = await this.getCartJwtToken(this.addCartsJwt(jwtPayload, [id]))

    return {
      access_token,
      token_type,
      expires_in,
      cartId: id,
    };
  }

  async patchCart(payload: JwtPayload, cartUpdateDto: CartUpdateDto): Promise<OrderCart> {
    this.checkCartPermission(payload, cartUpdateDto.cartId);

    const orderCart = await this.orderCartRepository.findOne({ where: { id: cartUpdateDto.cartId } });
    if (!orderCart) {
      throw new HttpException(
        `Cart id: ${cartUpdateDto.cartId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (cartUpdateDto.orderTypeId !== undefined) {
      orderCart.orderTypeId = cartUpdateDto.orderTypeId;
    }

    if (cartUpdateDto.storeId !== undefined) {
      orderCart.storeId = cartUpdateDto.storeId;
    }

    if (cartUpdateDto.companyId !== undefined) {
      orderCart.companyId = cartUpdateDto.companyId;
    }

    if (cartUpdateDto.cityId !== undefined) {
      orderCart.cityId = cartUpdateDto.cityId;
    }

    if (cartUpdateDto.order !== undefined) {
      orderCart.order = cartUpdateDto.order;
    }

    return this.orderCartRepository.save(orderCart);
  }

  async getCart(payload: JwtPayload, cartId: number): Promise<OrderCart> {
    this.checkCartPermission(payload, cartId);

    return this.orderCartRepository.findOne({
      where: { id: cartId },
    });
  }

  async getCarts(payload: JwtPayload): Promise<OrderCart[]> {
    if (!payload.carts || payload.carts.length === 0) {
      throw new HttpException('Carts not found', HttpStatus.NOT_FOUND);
    }

    return this.orderCartRepository.find({
      where: { id: In(payload.carts) },
    });
  }

  async deleteCart(payload: JwtPayload, cartUpdateDto: CartUpdateDto): Promise<JwtResponse> {
    this.checkCartPermission(payload, cartUpdateDto.cartId);

    const result = await this.orderCartRepository.delete(cartUpdateDto.cartId);

    if (result.affected === 0) {
      throw new HttpException(
        `Cart id: ${cartUpdateDto.cartId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.getCartJwtToken(this.removeCartsJwt(payload, [cartUpdateDto.cartId]), true);
  }

  async deanonymizationCart(payload: JwtPayload, userId: number): Promise<number[]> {
    if (payload && payload.carts && payload.carts.length) {
      await this.orderCartRepository.update(
        { id: In(payload.carts) },
        { userId }
      );
      return payload.carts;
    }
    return [];
  }

  private addCartsJwt(payload: JwtPayload, carts: number[]): JwtPayload {
    const { exp, iat, ...cleanPayload } = payload;
    payload = cleanPayload;
    payload.carts.push(...carts);
    return payload;
  }

  private removeCartsJwt(payload: JwtPayload, carts: number[]): JwtPayload {
    const { exp, iat, ...cleanPayload } = payload;
    cleanPayload.carts = cleanPayload.carts.filter(cart => !carts.includes(cart));
    return cleanPayload;
  }

  private checkCartPermission(payload: JwtPayload, cartId: number): void {
    if (!payload || !payload.carts || !payload.carts.includes(cartId)) {
      throw new HttpException(
        `Cart id: ${cartId} not found or you do not have permission to access it.`,
        HttpStatus.CONFLICT,
      );
    }
  }

  private checkEmptyJwtPayload(payload: JwtPayload): JwtPayload {
    if (!payload) {
      payload = {
        rmbMe: false,
        roles: [ROLE_ANONYMOUS],
        carts: []
      };
    }
    return payload;
  }

  private async getCartJwtToken(payload: JwtPayload, reset: boolean = false): Promise<JwtResponse> {
    const expiresIn = this.configService.get<string>(getJwtExpiresInEnv(payload.rmbMe, reset));
    return {
      access_token: await this.jwtService.signAsync(payload, { expiresIn }),
      token_type: TOKEN_TYPE,
      expires_in: expiresIn
    };
  }
}
