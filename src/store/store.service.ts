import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private storeRepositary: Repository<Store>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  cacheActiveStoresKey = 'activeStores';
  cacheActiveStoresTTL = 3600000; // 1Hour

  async getStores(): Promise<Store[]> {
    return await this.storeRepositary.find({});
  }

  async getActiveStores(): Promise<any> {
    const cacheActiveStores = await this.cacheManager.get(
      this.cacheActiveStoresKey,
    );
    if (cacheActiveStores) {
      return cacheActiveStores;
    }

    const stores = await this.storeRepositary.findBy({
      isActive: true,
    });

    await this.cacheManager.set(
      this.cacheActiveStoresKey,
      stores,
      this.cacheActiveStoresTTL,
    );

    return stores;
  }

  async getStoresByCityId(cityId: number): Promise<Store[]> {
    return await this.storeRepositary.findBy({
      cityId,
      isActive: true,
    });
  }
}
