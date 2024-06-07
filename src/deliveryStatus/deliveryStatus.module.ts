import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryStatus } from './entities/deliveryStatus.entity';
import { DeliveryStatusController } from './deliveryStatus.controller';
import { DeliveryStatusService } from './deliveryStatus.service';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryStatus])],
  controllers: [DeliveryStatusController],
  providers: [DeliveryStatusService],
  exports: [DeliveryStatusService, DeliveryStatusModule],
})
export class DeliveryStatusModule {}
