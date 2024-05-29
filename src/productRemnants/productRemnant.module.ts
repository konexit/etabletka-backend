import { Module } from '@nestjs/common';
import { ProductRemnantService } from './productRemnant.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRemnant } from './entities/productRemnant.entity';
import { ProductRemnantController } from './productRemnant.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductRemnant])],
  controllers: [ProductRemnantController],
  providers: [ProductRemnantService],
  exports: [ProductRemnantService, ProductRemnantModule],
})
export class ProductRemnantModule {}
