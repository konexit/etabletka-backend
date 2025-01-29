import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Badge } from './entities/badge.entity';
import { BadgeController } from './badget.controller';
import { BadgeService } from './badge.service';
import { Product } from '../product/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Badge, Product])],
  controllers: [BadgeController],
  providers: [BadgeService],
  exports: [BadgeService, BadgeModule],
})
export class BadgeModule {}
