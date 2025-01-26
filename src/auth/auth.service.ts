import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as crypto from 'crypto';
import { SALT, TOKEN_TYPE } from './auth.constants';
import { JWTPayload, JWTResponse } from './auth.interfaces';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private userService: UserService,
  ) { }

  async signIn(phone: string, password: string): Promise<JWTResponse> {
    const user = await this.userService.getByPhone(phone);
    if (!user) {
      throw new HttpException(
        `This phone: ${phone} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    password = crypto
      .pbkdf2Sync(password, this.configService.get<string>(SALT), 1000, 64, `sha512`)
      .toString(`hex`);

    const isMatch: boolean = password === user.password;
    if (!isMatch) {
      throw new HttpException(
        `The password: ${phone} miss match`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const payload: JWTPayload = {
      userId: user.id,
      roleId: user.roleId,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      token_type: TOKEN_TYPE,
      expires_in: ''
    };
  }
}
