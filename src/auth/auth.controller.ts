import { Body, Controller, Post, Get, HttpCode, UseGuards, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import AuthDto from './dto/auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtResponse } from './auth.interfaces';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';

@ApiTags('auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() authDto: AuthDto): Promise<JwtResponse> {
    return this.authService.signIn(authDto);
  }
  @UseGuards(JwtAuthGuard)
  @Get('token/test')
  async test(): Promise<string> {
    return "ok";
  }
}
