import { Controller } from '@nestjs/common';
import { DeliveryStatusService } from './deliveryStatus.service';
import { DeliveryStatus } from './entities/deliveryStatus.entity';

@Controller('api/v1')
export class DeliveryStatusController {
  constructor(private readonly deliveryStatusService: DeliveryStatusService) {}

  async getDeliveryStatuses(): Promise<DeliveryStatus[]> {
    return await this.deliveryStatusService.getDeliveryStatuses();
  }
}
