import * as FormData from 'form-data';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { AUTH_PROVIDER_MANAGER, AuthProvider } from '../auth';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { CDN_SERVICE_URL } from './cdn.constants';
import {
  ICDNUploadOptions,
  CDNUploadResponse,
  CDNResponse,
  CDNSearchResponse,
  CDNListResponse
} from './cdn.interface';

@Injectable()
export class CDNProvider {
  private readonly logger = new Logger(CDNProvider.name);
  private axiosInstance: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  constructor(
    private configService: ConfigService,
    @Inject(AUTH_PROVIDER_MANAGER)
    private authProvider: AuthProvider
  ) {
    this.axiosInstance = axios.create({
      baseURL: this.configService.get<string>(CDN_SERVICE_URL),
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 60_000,
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

  async uploadFile(file: Express.Multer.File, options: ICDNUploadOptions): Promise<CDNUploadResponse> {
    const formData = new FormData();
    formData.append(options.input, file.buffer, { filename: file.originalname });
    const response = await this.axiosInstance.post<CDNUploadResponse>(
      `/upload/${options.getQueryParams()}`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );
    return response.data;
  }

  async deleteFile(filename: string, path?: string): Promise<CDNResponse> {
    const response = await this.axiosInstance.post<CDNResponse>(
      `/delete/?filename=${filename}${path ? `&path=${path}` : ''}`,
    );
    return response.data;
  }

  async searchFile(search: string, path?: string): Promise<CDNSearchResponse> {
    const response = await this.axiosInstance.post<CDNSearchResponse>(
      `/search/?search=${search}${path ? `&path=${path}` : ''}`,
    );
    return response.data;
  }

  async showFiles(path?: string): Promise<CDNListResponse> {
    const response = await this.axiosInstance.post<CDNListResponse>(
      `/list/${path ? `?path=${path}` : ''}`,
    );
    return response.data;
  }
}


