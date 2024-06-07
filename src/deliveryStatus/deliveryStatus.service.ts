import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeliveryStatus } from './entities/deliveryStatus.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class DeliveryStatusService {
  constructor(
    @InjectRepository(DeliveryStatus)
    private deliveryRepository: Repository<DeliveryStatus>,
    private jwtService: JwtService,
  ) {}

  async getDeliveryStatuses(): Promise<DeliveryStatus[]> {
    const deliveryStatuses: DeliveryStatus[] =
      await this.deliveryRepository.find({});

    if (!deliveryStatuses) {
      throw new HttpException(
        'Delivery statuses not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return deliveryStatuses;
  }
}
