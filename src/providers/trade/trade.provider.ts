import { Injectable, Inject, Logger } from '@nestjs/common';
import { AUTH_PROVIDER_MANAGER, AuthProvider } from '../auth';
import { ConfigService } from '@nestjs/config';
import { TRADE_SERVICES_URL } from './trade.constants';
import axios, { AxiosInstance } from 'axios';
import {
  BodyListBuilder,
  CommonOrderBuilder,
  InsuranceOrderBuilder,
  OrderService,
  ToOrderBuilder,
  TradeOrderChangesAggregatorBuilder
} from './services';
import {
  TradeOrdersResponse,
  ITradeOrdersOptions,
  TradeOrders,
  ITradeStateOrdersOptions,
  TradeStateOrdersResponse,
  TradeStateOrdersAppliedResponse,
  ITradeStateOrdersAppliedOptions,
  ISearchOptions,
  TradeOrderChangesAggregator,
  TradeOrderChangeResponse
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
    @Inject(AUTH_PROVIDER_MANAGER)
    private readonly authProvider: AuthProvider
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

  async createOrders(orders: TradeOrders, options: ITradeOrdersOptions): Promise<TradeOrdersResponse> {
    const response = await this.axiosInstance.post<TradeOrdersResponse>(
      `${this.apiVersion}/companies/orders/${options.orderType}?action=${options.action}`,
      orders
    );
    return response.data;
  }

  async changeOrders(orders: TradeOrderChangesAggregator): Promise<TradeOrderChangeResponse> {
    const response = await this.axiosInstance.post<TradeOrderChangeResponse>(
      `${this.apiVersion}/orders/change`,
      orders
    );
    return response.data;
  }

  async getStateOrders(options: ITradeStateOrdersOptions): Promise<TradeStateOrdersResponse> {
    const response = await this.axiosInstance.get<TradeStateOrdersResponse>(
      `${this.apiVersion}/companies/orders/state${options.getQueryParams()}`
    );
    return response.data;
  }

  async applyStateOrders(options: ITradeStateOrdersAppliedOptions): Promise<TradeStateOrdersAppliedResponse> {
    const response = await this.axiosInstance.post<TradeStateOrdersAppliedResponse>(
      `${this.apiVersion}/companies/orders/state/applied`,
      options
    );
    return response.data;
  }

  async search<T>(options: ISearchOptions): Promise<T> {
    const response = await this.axiosInstance.post<T>(
      `${this.apiVersion}/search`,
      options
    );
    return response.data;
  }

  createCommonBodyListBuilder(): BodyListBuilder {
    return this.orderService.createCommonBodyListBuilder();
  }

  createCommonOrderBuilder(): CommonOrderBuilder {
    return this.orderService.createCommonOrderBuilder();
  }

  createInsuranceOrderBuilder(): InsuranceOrderBuilder {
    return this.orderService.createInsuranceOrderBuilder();
  }

  createToOrderBuilder(): ToOrderBuilder {
    return this.orderService.createToOrderBuilder();
  }

  createOrderChangesAggregatorBuilder(): TradeOrderChangesAggregatorBuilder {
    return this.orderService.createOrderChangesAggregatorBuilder();
  }
}

