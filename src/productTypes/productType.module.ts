import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTypeController } from './productType.controller';
import { ProductTypeService } from './productType.service';
import ProductType from './entities/productType.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductType])],
  controllers: [ProductTypeController],
  providers: [ProductTypeService],
  exports: [ProductTypeService, ProductTypeModule],
})
export class ProductTypeModule {}