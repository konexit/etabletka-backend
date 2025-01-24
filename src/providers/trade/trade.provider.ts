import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { AUTH_PROVIDER_MANAGER, AuthProvider } from '../auth';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { OrderService, OrderStatusService } from './services';
import { TRADE_SERVICES_URL } from './trade.constants';

@Injectable()
export class TradeProvider implements OnModuleInit {
  private axiosInstance: AxiosInstance;

  constructor(
    private readonly configService: ConfigService,
    private readonly orderService: OrderService,
    private readonly orderStatusService: OrderStatusService,
    @Inject(AUTH_PROVIDER_MANAGER) private readonly authProvider: AuthProvider
  ) {
    this.axiosInstance = axios.create({
      baseURL: this.configService.get<string>(TRADE_SERVICES_URL),
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    });
  }

  async onModuleInit(): Promise<void> {
    const token = await this.authProvider.getAuthToken(AUTH_PROVIDER_MANAGER);
    console.log("Token Trade:", token);
  }
}

