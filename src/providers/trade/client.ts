import { Injectable } from '@nestjs/common';
import { AuthProvider } from '../auth/client';
import { ConfigService } from '@nestjs/config';
import { TRADE_SERVICES_URL } from './config/const';
import { OrderService, OrderStatusService } from './services';

@Injectable()
export class TradeProvider {
  private url: string;
  private headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  constructor(
    private readonly configService: ConfigService,
    private readonly orderService: OrderService,
    private readonly orderStatusService: OrderStatusService,
    private readonly authProvider: AuthProvider
  ) {
    this.url = this.configService.get<string>(TRADE_SERVICES_URL);
  }

}
