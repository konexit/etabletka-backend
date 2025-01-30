import * as dayjs from 'dayjs';
import { Cache, caching } from 'cache-manager';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { Credentials, TokenResponse } from './auth.interfaces';
import { AUTH_SERVICES_URL } from './auth.constants';


@Injectable()
export class AuthProvider implements OnModuleInit {
  private keyManager: string;
  private localCacheManager: Cache;
  private axiosInstance: AxiosInstance;
  private credentials: Credentials;

  constructor(private readonly configService: ConfigService) {
    this.axiosInstance = axios.create({
      baseURL: this.configService.get<string>(AUTH_SERVICES_URL),
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    });
  }

  async onModuleInit(): Promise<void> {
    this.localCacheManager = await caching('memory', {
      max: 100,
      ttl: 0,
    });
  }

  setCredentials(keyManager: string, credentials: Credentials): void {
    this.keyManager = keyManager;
    this.credentials = credentials;
  }

  async getAuthToken(): Promise<string> {
    const cachedToken = await this.localCacheManager.get<string>(this.keyManager);
    if (cachedToken) {
      return cachedToken;
    }

    const { data: { token_type, access_token } } = await this.getToken();
    return `${token_type} ${access_token}`;
  }

  async refreshAuthToken(): Promise<string> {
    return this.getToken();
  }

  private async getToken(): Promise<any> {
    const response = await this.axiosInstance.post<TokenResponse>('/login', this.credentials);

    const { data: { access_token, token_type, expires_in } } = response;
    const expiresAt = dayjs(expires_in).valueOf();

    const ttl = Math.floor((expiresAt - Date.now()) - 60_000); //ms

    await this.localCacheManager.set(this.keyManager, `${token_type} ${access_token}`, ttl);
    return response;
  }
}
