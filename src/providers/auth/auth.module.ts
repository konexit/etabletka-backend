import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthProvider } from './auth.provider';
import { AuthCacheService } from './auth.cache.service';
import {
  AUTH_SERVICE_USER_LOGIN,
  AUTH_SERVICE_USER_PASSWORD,
  AUTH_SERVICE_USER_TYPE,
  AUTH_PROVIDER_MANAGER
} from './auth.constants';

@Module({
  imports: [],
  providers: [
    AuthCacheService,
    {
      provide: AUTH_PROVIDER_MANAGER,
      useFactory: (configService: ConfigService, authCacheService: AuthCacheService) => {
        const authProvider = new AuthProvider(configService, authCacheService);
        authProvider.setCredentials({
          login: configService.get<string>(AUTH_SERVICE_USER_LOGIN),
          password: configService.get<string>(AUTH_SERVICE_USER_PASSWORD),
          user_type: configService.get<string>(AUTH_SERVICE_USER_TYPE),
        });
        return authProvider;
      },
      inject: [ConfigService, AuthCacheService],
    },
  ],
  exports: [AUTH_PROVIDER_MANAGER],
})
export class AuthModule { }