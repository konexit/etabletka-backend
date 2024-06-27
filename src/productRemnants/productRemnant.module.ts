import { Module } from '@nestjs/common';
import { ProductRemnantService } from './productRemnant.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRemnant } from './entities/productRemnant.entity';
import { ProductRemnantController } from './productRemnant.controller';
import { Store } from '../store/entities/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductRemnant, Store])],
  controllers: [ProductRemnantController],
  providers: [ProductRemnantService],
  exports: [ProductRemnantService, ProductRemnantModule],
})
export class ProductRemnantModule {}
