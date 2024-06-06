import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import AuthDto from './dto/auth.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: AuthDto, @Res() res: any): Promise<any> {
    try {
      const authRes = await this.authService.signIn(
        signInDto.phone,
        signInDto.password,
      );

      if (authRes?.token) res.header('Authorization', authRes?.token);

      return res.json(authRes);
    } catch (error) {
      return res.status(error.status).json({ error: error });
    }
  }
}
