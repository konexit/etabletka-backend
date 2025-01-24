import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OrderService {
    constructor(
        private readonly configService: ConfigService,
    ) { }
}
