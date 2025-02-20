import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthProvider } from './auth.provider';
import {
  AUTH_SERVICE_USER_LOGIN,
  AUTH_SERVICE_USER_PASSWORD,
  AUTH_SERVICE_USER_TYPE,
  AUTH_PROVIDER_MANAGER,
} from './auth.constants';
import { CacheModule, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Module({
  imports: [
    CacheModule.register({
      store: 'memory',
      max: 100,
      ttl: 0,
    }),
  ],
  providers: [
    {
      provide: AUTH_PROVIDER_MANAGER,
      inject: [ConfigService, CACHE_MANAGER],
      useFactory: (configService: ConfigService, cacheManager: Cache) => {
        const authProvider = new AuthProvider(configService, cacheManager);
        authProvider.setCredentials(AUTH_PROVIDER_MANAGER, {
          login: configService.get<string>(AUTH_SERVICE_USER_LOGIN),
          password: configService.get<string>(AUTH_SERVICE_USER_PASSWORD),
          user_type: configService.get<string>(AUTH_SERVICE_USER_TYPE),
        });
        return authProvider;
      },
    },
  ],
  exports: [AUTH_PROVIDER_MANAGER],
})
export class AuthModule {}
