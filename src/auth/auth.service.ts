import { Injectable, UnauthorizedException } from '@nestjs/common';
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

  async signIn(email: string, password: string): Promise<any> {
    const user = await this.userService.getByEmail(email);
    if (!user.password) throw new UnauthorizedException();

    const salt = this.configService.get('SALT');
    password = crypto
      .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
      .toString(`hex`);

    const isMatch = password === user.password;
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const payload = {
      email: user.email,
      sub: user.id,
      userType: user.userType,
    };
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}
