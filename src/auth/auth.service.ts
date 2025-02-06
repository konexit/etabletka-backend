import * as dayjs from 'dayjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/user/user.service';
import { JWT_EXPIRES_IN, SALT, TOKEN_TYPE } from './auth.constants';
import { JwtPayload, JwtResponse } from 'src/common/types/jwt/jwt.interfaces';
import { User } from 'src/users/user/entities/user.entity';
import AuthDto from './dto/auth.dto';
import { generateRandomNumber, getPasswordWithSHA512 } from 'src/common/utils';
import { USER_ACTIVATION_CODE_DELAY, USER_PASSWORD_ACTIVATION_CODE_SIZE } from 'src/common/config/common.constants';
import { ActivationCodeDto } from './dto/activation.dto';
import { SMSProvider } from 'src/providers/sms';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private userService: UserService,
    private smsProvider: SMSProvider
  ) { }

  async signIn(authDto: AuthDto): Promise<JwtResponse> {
    const user = await this.userService.getUserForJwtByLogin(authDto.login);
    if (!user) {
      throw new HttpException(
        `This login: ${authDto.login} not found`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const password = getPasswordWithSHA512(authDto.password, this.configService.get<string>(SALT));

    if (user.password !== password) {
      throw new HttpException(
        `The password: ${authDto.login} miss match`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    return this.getJwtToken(user);
  }

  async checkUniqueLogin(login: string): Promise<void> {
    return this.userService.checkUniqueLogin(login);
  }

  async activation(login: string, code: string): Promise<JwtResponse> {
    const user = await this.userService.getUserForJwtByLogin(login, false);
    if (!user) {
      throw new HttpException(
        'User with this login does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    if (user.code !== code) {
      throw new HttpException(
        'User activation code miss match',
        HttpStatus.CONFLICT,
      );
    }

    user.code = null;
    user.isActive = true;

    await this.userService.save(user);

    return this.getJwtToken(user);
  }

  async activationCode(activationCodeDto: ActivationCodeDto): Promise<void> {
    const user = await this.userService.getByLoginForActivation(activationCodeDto.login);

    if (!user) {
      throw new HttpException(
        'User with this login does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    if (dayjs(user.updatedAt).add(USER_ACTIVATION_CODE_DELAY, 'second').isAfter(dayjs())) {
      throw new HttpException(
        'Request timed out',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    user.code = generateRandomNumber(USER_PASSWORD_ACTIVATION_CODE_SIZE);

    await this.smsProvider.sendSMS(
      [activationCodeDto.phone],
      `Recovery code: ${user.code}`,
    );

    await this.userService.save(user);

    return;
  }

  async getJwtToken(user: User): Promise<JwtResponse> {
    const payload: JwtPayload = {
      userId: user.id,
      roles: [user.role.role]
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      token_type: TOKEN_TYPE,
      expires_in: this.configService.get<string>(JWT_EXPIRES_IN)
    };
  }
}
