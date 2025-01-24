import * as dayjs from 'dayjs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { Credentials, TokenResponse } from './auth.interfaces';
import { AUTH_SERVICES_URL } from './auth.constants';
import { AuthCacheService } from './auth.cache.service';


@Injectable()
export class AuthProvider {
  private axiosInstance: AxiosInstance;
  private credentials: Credentials;

  constructor(
    private readonly configService: ConfigService,
    private readonly authCacheService: AuthCacheService,
  ) {
    this.axiosInstance = axios.create({
      baseURL: this.configService.get<string>(AUTH_SERVICES_URL),
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    });
  }

  setCredentials(credentials: Credentials): void {
    this.credentials = credentials;
  }

  async getAuthToken(authProviderManager: string): Promise<string> {
    const cachedToken = await this.authCacheService.get<string>(authProviderManager);
    if (cachedToken) {
      return cachedToken;
    }

    const { data: { token_type, access_token } } = await this.getToken(authProviderManager);
    return `${token_type} ${access_token}`;
  }

  async refreshAuthToken(authProviderManager: string): Promise<string> {
    return this.getToken(authProviderManager);
  }

  private async getToken(authProviderManager: string): Promise<any> {
    const response = await this.axiosInstance.post<TokenResponse>('/login', this.credentials);

    const { data: { access_token, token_type, expires_in } } = response;
    const expiresAt = dayjs(expires_in).valueOf();

    const ttl = Math.floor((expiresAt - Date.now()) - 60_000); //ms

    await this.authCacheService.set(authProviderManager, `${token_type} ${access_token}`, ttl);
    return response;
  }
}
