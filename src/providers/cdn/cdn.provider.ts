import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { AUTH_PROVIDER_MANAGER, AuthProvider } from '../auth';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { CDNService } from './services';
import { CDN_SERVICES_URL } from './cdn.constants';

@Injectable()
export class CDNProvider implements OnModuleInit {
  private axiosInstance: AxiosInstance;

  constructor(
    private readonly configService: ConfigService,
    private readonly cndService: CDNService,
    @Inject(AUTH_PROVIDER_MANAGER) private readonly authProvider: AuthProvider
  ) {
    this.axiosInstance = axios.create({
      baseURL: this.configService.get<string>(CDN_SERVICES_URL),
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    });
  }

  async onModuleInit(): Promise<void> {
    const token = await this.authProvider.getAuthToken(AUTH_PROVIDER_MANAGER);
    console.log("Token CDN:", token);
  }
}


