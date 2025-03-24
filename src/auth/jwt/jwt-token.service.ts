import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JWT_CART_EXPIRES_IN, JWT_EXPIRES_IN, JWT_REMEMBER_ME_EXPIRES_IN, TOKEN_TYPE } from 'src/auth/auth.constants';
import { JWT_DEFAULT_EXPIRES_IN } from 'src/common/config/common.constants';
import { JwtPayload, JwtResponse } from 'src/common/types/jwt/jwt.interfaces';
import { ROLE_JWT_ANONYMOUS } from 'src/users/role/user-role.constants';

@Injectable()
export class JwtTokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async generateToken(payload: JwtPayload, isCart: boolean = false): Promise<JwtResponse> {
    const expiresIn = this.configService.get<string>(this.getJwtExpiresInEnv(payload.rmbMe, isCart)) || JWT_DEFAULT_EXPIRES_IN;
    return {
      access_token: await this.jwtService.signAsync(payload, { expiresIn }),
      token_type: TOKEN_TYPE,
      expires_in: expiresIn,
    };
  }

  addCartsToJwt(payload: JwtPayload, carts: number[]): JwtPayload {
    const { exp, iat, ...cleanPayload } = payload;
    cleanPayload.carts = [...(cleanPayload.carts || []), ...carts];
    return cleanPayload;
  }

  removeCartsFromJwt(payload: JwtPayload, carts: number[]): JwtPayload {
    const { exp, iat, ...cleanPayload } = payload;
    cleanPayload.carts = cleanPayload.carts?.filter(cart => !carts.includes(cart)) || [];
    return cleanPayload;
  }

  validateCartAccess(payload: JwtPayload, cartId: number): void {
    if (!payload?.carts?.includes(cartId)) {
      throw new HttpException(`Cart id: ${cartId} not found or access denied.`, HttpStatus.CONFLICT);
    }
  }

  ensureJwtPayload(payload: JwtPayload): JwtPayload {
    return payload || { rmbMe: false, roles: [ROLE_JWT_ANONYMOUS], carts: [] };
  }

  private getJwtExpiresInEnv(remember = false, isCart = false): string {
    return remember ? JWT_REMEMBER_ME_EXPIRES_IN : isCart ? JWT_CART_EXPIRES_IN : JWT_EXPIRES_IN;
  }
}