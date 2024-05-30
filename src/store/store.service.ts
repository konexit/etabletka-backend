import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private storeRepositary: Repository<Store>,
  ) {}

  async getStores(): Promise<Store[]> {
    return await this.storeRepositary.find({});
  }

  async getActiveStores(): Promise<Store[]> {
    return await this.storeRepositary.findBy({
      isActive: true,
    });
  }

  async getStoresByCityId(cityId: number): Promise<Store[]> {
    return await this.storeRepositary.findBy({
      cityId,
      isActive: true,
    });
  }
}
