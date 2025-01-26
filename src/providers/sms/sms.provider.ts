import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { SMS_CLUB_SENDER, SMS_CLUB_TOKEN, SMS_CLUB_URL } from './sms.constants';

@Injectable()
export class SMSProvider {
  private axiosInstance: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    this.axiosInstance = axios.create({
      baseURL: this.configService.get<string>(SMS_CLUB_URL),
      headers: {
        Authorization: `Bearer ${this.configService.get<string>(SMS_CLUB_TOKEN)}`,
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    });
  }

  async sendSMS(phones: string[], message: string): Promise<any> {
    return this.axiosInstance.post('/sms/send', {
      phone: phones,
      message: message,
      src_addr: this.configService.get<string>(SMS_CLUB_SENDER),
    });
  }
}
