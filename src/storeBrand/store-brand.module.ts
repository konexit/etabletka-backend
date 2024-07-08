import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreBrand } from './entities/store-brand.entity';
import { StoreBrandController } from './store-brand.controller';
import { StoreBrandService } from './store-brand.service';


@Module({
  imports: [TypeOrmModule.forFeature([StoreBrand])],
  controllers: [StoreBrandController],
  providers: [StoreBrandService],
  exports: [StoreBrandService, StoreBrandModule],
})
export class StoreBrandModule {}
