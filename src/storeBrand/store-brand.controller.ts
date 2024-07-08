import { Controller, Get } from '@nestjs/common';
import { StoreBrandService } from './store-brand.service';
import { StoreBrand } from './entities/store-brand.entity';

@Controller('api/v1')
export class StoreBrandController {
  constructor(private readonly storeBrand: StoreBrandService) {}

  @Get('/store/brands')
  async getAllStoreBrands(): Promise<StoreBrand[]> {
    return await this.storeBrand.getAllStoreBrands();
  }
}
