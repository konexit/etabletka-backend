import {
  Body,
  Controller,
  Post,
  Get,
  HttpCode,
  UseGuards,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor
} from '@nestjs/common';
import { AuthService } from './auth.service';
import AuthDto from './dto/auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtResponse } from 'src/common/types/jwt/jwt.interfaces';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { ActivationCodeDto, ActivationDto } from './dto/activation.dto';
import { UniqueLoginDto } from 'src/users/user/dto/unique-login.dto';

@ApiTags('auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() authDto: AuthDto): Promise<JwtResponse> {
    return this.authService.signIn(authDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('login/check')
  async checkUniqueLogin(@Body() uniqueLoginDto: UniqueLoginDto): Promise<void> {
    return this.authService.checkUniqueLogin(uniqueLoginDto.login);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('user/activation')
  async activation(@Body() activationDto: ActivationDto): Promise<JwtResponse> {
    return this.authService.activation(activationDto.login, activationDto.code);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('activation/code')
  async activationCode(@Body() activationCodeDto: ActivationCodeDto): Promise<void> {
    return this.authService.activationCode(activationCodeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('token/test')
  async test(): Promise<string> {
    return "ok";
  }
}
