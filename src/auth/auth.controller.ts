import {
  Body,
  Controller,
  Post,
  Get,
  HttpCode,
  UseGuards,
  HttpStatus,
  ValidationPipe,
  UsePipes
} from '@nestjs/common';
import { AuthService } from './auth.service';
import AuthDto from './dto/auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtPayload, JwtResponse } from 'src/common/types/jwt/jwt.interfaces';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { ActivationCodeDto, ActivationDto } from './dto/activation.dto';
import { UniqueLoginDto } from 'src/users/user/dto/unique-login.dto';
import { JWTPayload } from 'src/common/decorators/jwt-payload';
import { OptionalJwtAuthGuard } from './jwt/optional-jwt-auth.guard';

@ApiTags('auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UseGuards(OptionalJwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async signIn(
    @JWTPayload() jwtPayload: JwtPayload,
    @Body() authDto: AuthDto
  ): Promise<JwtResponse> {
    return this.authService.signIn(jwtPayload, authDto);
  }

  @Post('login/check')
  async checkUniqueLogin(@Body() uniqueLoginDto: UniqueLoginDto): Promise<void> {
    return this.authService.checkUniqueLogin(uniqueLoginDto.login);
  }

  @Post('user/activation')
  @UseGuards(OptionalJwtAuthGuard)
  async activation(
    @JWTPayload() jwtPayload: JwtPayload,
    @Body() activationDto: ActivationDto
  ): Promise<JwtResponse> {
    return this.authService.activation(jwtPayload, activationDto);
  }

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
