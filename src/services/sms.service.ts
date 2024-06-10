import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class SmsService {
  constructor(private readonly configService: ConfigService) {}

  async sendSMS(phones: string[], message: string) {
    const token = `Bearer ${this.configService.get('SMS_CLUB_TOKEN')}`;

    const data = {
      phone: phones,
      message: message,
      src_addr: this.configService.get('SMS_CLUB_SENDER'),
    };

    const headers = {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    };

    await axios
      .post(this.configService.get('SMS_CLUB_URL'), data, { headers })
      .then((response) => {
        console.log('DATA', response.data);
        return response.data;
      })
      .catch((error) => console.error(error));
  }
}
