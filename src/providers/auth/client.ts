import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { handleAxiosError } from 'src/common/utils';
import { Credentials, TokenResponse } from './types';
import {
  AUTH_SERVICES_URL,
  AUTH_SERVICE_USER_LOGIN,
  AUTH_SERVICE_USER_PASSWORD,
  AUTH_SERVICE_USER_TYPE
} from './config/const';

@Injectable()
export class AuthProvider {
  private axiosInstance: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    this.axiosInstance = axios.create({
      baseURL: this.configService.get<string>(AUTH_SERVICES_URL),
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    });
  }

  async getTokenByCredentials(credentials: Credentials): Promise<string> {
    try {
      const response = await this.axiosInstance.post<TokenResponse>('/login', credentials);

      return `${response.data.token_type} ${response.data.access_token}`;
    } catch (error) {
      handleAxiosError(error);
      return '';
    }
  }

  async getTokenWithEtabletkaCredentials(): Promise<string> {
    return this.getTokenByCredentials(this.getEtabletkaCredentials());
  }

  getEtabletkaCredentials(): Credentials {
    return {
      login: this.configService.get<string>(AUTH_SERVICE_USER_LOGIN),
      password: this.configService.get<string>(AUTH_SERVICE_USER_PASSWORD),
      user_type: this.configService.get<string>(AUTH_SERVICE_USER_TYPE),
    }
  }
}
