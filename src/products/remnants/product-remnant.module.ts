import { Module } from '@nestjs/common';
import { ProductRemnantService } from './product-remnant.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRemnant } from './entities/product-remnant.entity';
import { ProductRemnantController } from './product-remnant.controller';
import { Store } from 'src/store/entities/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductRemnant, Store])],
  controllers: [ProductRemnantController],
  providers: [ProductRemnantService],
  exports: [ProductRemnantService, ProductRemnantModule],
})
export class ProductRemnantModule {}
