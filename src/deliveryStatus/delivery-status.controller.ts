import { Controller } from '@nestjs/common';
import { DeliveryStatusService } from './delivery-status.service';
import { DeliveryStatus } from './entities/delivery-status.entity';

@Controller('api/v1')
export class DeliveryStatusController {
  constructor(private readonly deliveryStatusService: DeliveryStatusService) {}

  async getDeliveryStatuses(): Promise<DeliveryStatus[]> {
    return await this.deliveryStatusService.getDeliveryStatuses();
  }
}