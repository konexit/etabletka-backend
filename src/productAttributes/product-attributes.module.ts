import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductAttributesController } from './product-attributes.controller';
import { ProductAttributesService } from './product-attributes.service';
import { ProductAttributes } from './entities/product-attributes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductAttributes]),
  ],
  controllers: [ProductAttributesController],
  providers: [ProductAttributesService],
  exports: [ProductAttributesService, ProductAttributesModule],
})
export class ProductAttributesModule { }
