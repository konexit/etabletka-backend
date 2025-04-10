import * as dayjs from 'dayjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtTokenService } from './jwt/jwt-token.service';
import { UserService } from 'src/user/user.service';
import { CartService } from 'src/commerce/cart/cart.service';
import { USER_ACTIVATION_CODE_DELAY, USER_PASSWORD_ACTIVATION_CODE_SIZE } from 'src/common/config/common.constants';
import { User } from 'src/user/entities/user.entity';
import { JwtPayload, JwtResponse } from 'src/common/types/jwt/jwt.interfaces';
import { ActivationCodeDto, ActivationDto } from './dto/activation.dto';
import AuthDto from './dto/auth.dto';
import { SMSProvider } from 'src/providers/sms';
import { generateRandomNumber, hashPassword } from 'src/common/utils';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtTokenService: JwtTokenService,
    private userService: UserService,
    private cartService: CartService,
    private smsProvider: SMSProvider
  ) { }

  async signIn(payload: JwtPayload, authDto: AuthDto): Promise<JwtResponse> {
    const user = await this.userService.getUserForJwtByLogin(authDto.login);
    if (!user) {
      throw new HttpException(
        `This login: ${authDto.login} not found`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const password = await hashPassword(authDto.password);

    if (user.password !== password) {
      throw new HttpException(
        `The password: ${authDto.login} miss match`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    return this.getJwtToken(payload, user, authDto.rememberMe ?? false);
  }

  async checkUniqueLogin(login: string): Promise<void> {
    return this.userService.checkUniqueLogin(login);
  }

  async activation(payload: JwtPayload, activationDto: ActivationDto): Promise<JwtResponse> {
    const user = await this.userService.getUserForJwtByLogin(activationDto.login, false);
    if (!user) {
      throw new HttpException(
        'User with this login does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    if (user.code !== activationDto.code) {
      throw new HttpException(
        'User activation code miss match',
        HttpStatus.BAD_REQUEST,
      );
    }

    user.code = null;
    user.isActive = true;

    await this.userService.save(user);

    return this.getJwtToken(payload, user, payload?.rmbMe ?? false);
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

  async getJwtToken(payload: JwtPayload, user: User, rememberMe: boolean = false): Promise<JwtResponse> {
    const carts = await this.cartService.associateCartsWithUser(payload, user.id);
    const jwtPayload: JwtPayload = {
      rmbMe: rememberMe,
      userId: user.id,
      roles: [user.role.role],
      carts
    };

    return this.jwtTokenService.generateToken(jwtPayload, !!carts.length);
  }
}
