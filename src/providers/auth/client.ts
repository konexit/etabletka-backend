import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Credentials, TokenResponse } from './types';
import {
  AUTH_SERVICES_URL,
  AUTH_SERVICE_USER_LOGIN,
  AUTH_SERVICE_USER_PASSWORD,
  AUTH_SERVICE_USER_TYPE
} from './config/const';

@Injectable()
export class AuthProvider {
  private url: string;
  private headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  constructor(private readonly configService: ConfigService) {
    this.url = this.configService.get<string>(AUTH_SERVICES_URL);
  }

  async getTokenByCredentials(credentials: Credentials): Promise<string> {
    try {
      const response = await fetch(`${this.url}/login`, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        return "";
      }

      const data: TokenResponse = await response.json();
      return `${data.token_type} ${data.access_token}`;
    } catch (error) {
      return "";
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
