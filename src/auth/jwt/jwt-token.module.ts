import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../auth.constants';
import { JwtStrategy } from './jwt.strategy';
import { JwtTokenService } from './jwt-token.service';

@Global()
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>(JWT_SECRET),
        signOptions: { expiresIn: configService.get<string>(JWT_EXPIRES_IN) },
      }),
    }),
  ],
  providers: [JwtTokenService, JwtStrategy],
  exports: [JwtTokenService],
})
export class JwtTokenModule { }