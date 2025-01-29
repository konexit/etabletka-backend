import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/user/user.service';
import * as crypto from 'crypto';
import AuthDto from './dto/auth.dto';
import { SALT, TOKEN_TYPE } from './auth.constants';
import { JwtPayload, JwtResponse } from './auth.interfaces';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private userService: UserService,
  ) { }

  async signIn(authDto: AuthDto): Promise<JwtResponse> {
    const user = await this.userService.getByPhone(authDto.login);
    if (!user) {
      throw new HttpException(
        `This login: ${authDto.login} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const password = crypto
      .pbkdf2Sync(authDto.password, this.configService.get<string>(SALT), 1000, 64, `sha512`)
      .toString(`hex`);

    if (!(user.password === password)) {
      throw new HttpException(
        `The login: ${authDto.login} miss match`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const payload: JwtPayload = {
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
