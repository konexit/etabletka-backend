import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountGroup } from './entities/discount-group.entity';
import { DiscountGroupController } from './discount-group.controller';
import { DiscountGroupService } from './discount-group.service';

@Module({
  imports: [TypeOrmModule.forFeature([DiscountGroup])],
  controllers: [DiscountGroupController],
  providers: [DiscountGroupService],
  exports: [DiscountGroupService],
})
export class DiscountGroupModule {}
