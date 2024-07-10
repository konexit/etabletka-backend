import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryStatus } from './entities/delivery-status.entity';
import { DeliveryStatusController } from './delivery-status.controller';
import { DeliveryStatusService } from './delivery-status.service';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryStatus])],
  controllers: [DeliveryStatusController],
  providers: [DeliveryStatusService],
  exports: [DeliveryStatusService, DeliveryStatusModule],
})
export class DeliveryStatusModule {}
