import { Injectable, Inject, Logger } from '@nestjs/common';
import { AUTH_PROVIDER_MANAGER, AuthProvider } from '../auth';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { OrderService, OrderStatusService } from './services';
import { TRADE_SERVICES_URL } from './trade.constants';
import {
  OrdersResponse,
  IOrdersOptions,
  TradeOrders,
  IStateOrdersOptions,
  StateOrdersResponse,
  StateOrdersAppliedResponse,
  IStateOrdersAppliedOptions
} from './interfaces';

@Injectable()
export class TradeProvider {
  private readonly logger = new Logger(TradeProvider.name);
  private axiosInstance: AxiosInstance;
  private apiVersion: string = '/api/v1';
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

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
      timeout: 30000,
    });
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        config.headers.Authorization = await this.authProvider.getAuthToken();
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve) => {
              this.refreshSubscribers.push((newToken) => {
                originalRequest.headers.Authorization = newToken;
                resolve(this.axiosInstance(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const token = await this.authProvider.refreshAuthToken();
            this.logger.log('token refreshed:', token);

            this.refreshSubscribers.forEach((callback) => callback(token));
            this.refreshSubscribers = [];

            originalRequest.headers.Authorization = token;
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            this.logger.error('token refresh failed:', refreshError);
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async createOrders(orders: TradeOrders, options: IOrdersOptions): Promise<OrdersResponse> {
    const response = await this.axiosInstance.post<OrdersResponse>(
      `${this.apiVersion}/companies/orders/${options.orderType}?action=${options.action}`,
      orders
    );
    return response.data;
  }

  async getStateOrders(options: IStateOrdersOptions): Promise<StateOrdersResponse> {
    const response = await this.axiosInstance.get<StateOrdersResponse>(
      `${this.apiVersion}/companies/orders/state${options.getQueryParams()}`
    );
    return response.data;
  }

  async applyStateOrders(options: IStateOrdersAppliedOptions): Promise<StateOrdersAppliedResponse> {
    const response = await this.axiosInstance.post<StateOrdersAppliedResponse>(
      `${this.apiVersion}/companies/orders/state/applied`,
      options
    );
    return response.data;
  }
}

