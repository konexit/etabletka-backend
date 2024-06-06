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
      const token = await this.authService.signIn(
        signInDto.phone,
        signInDto.password,
      );
      if (!token) {
        return res.status(403).json({ message: 'Phone or password incorrect' });
      }

      return res.json(token);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Internal server error', error: error });
    }
  }
}
