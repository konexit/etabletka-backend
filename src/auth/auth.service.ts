import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async signIn(phone: string, password: string): Promise<any> {
    const user = await this.userService.getByPhone(phone);
    if (!user) {
      throw new HttpException(
        `This phone: ${phone} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const salt = this.configService.get('SALT');
    password = crypto
      .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
      .toString(`hex`);

    const isMatch: boolean = password === user.password;
    if (!isMatch) {
      throw new HttpException(
        `The password: ${phone} miss match`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const payload: { id: number; roleId: number } = {
      id: user.id,
      roleId: user.roleId,
    };

    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}
