import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PaginationDto } from '../common/dto/paginationDto';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  cacheActiveStoresKey = 'activeStores';
  cacheActiveStoresTTL = 3600000; // 1Hour

  async getStores(token: string | any[]): Promise<Store[]> {
    if (!token || typeof token !== 'string') {
      throw new HttpException('No access', HttpStatus.FORBIDDEN);
    }

    const stores = await this.storeRepository.find({});
    if (!stores) {
      throw new HttpException('Stores not found', HttpStatus.NOT_FOUND);
    }

    return stores;
  }

  async getActiveStores(
    token: string | any[],
    pagination: PaginationDto = {},
    lang: string = 'uk',
  ): Promise<any> {
    if (!token || typeof token !== 'string') {
      const cacheActiveStores = await this.cacheManager.get(
        this.cacheActiveStoresKey,
      );
      if (cacheActiveStores) {
        return cacheActiveStores;
      }

      const stores: Store[] = await this.storeRepository.find({
        where: { isActive: true },
        relations: ['city', 'region', 'district', 'storeBrand'],
      });

      if (!stores) {
        throw new HttpException('Stores not found', HttpStatus.NOT_FOUND);
      }

      for (const store of stores) {
        store.name = store.name[lang];
      }
      await this.cacheManager.set(
        this.cacheActiveStoresKey,
        stores,
        this.cacheActiveStoresTTL,
      );

      return stores;
    } else {
      const { take = 16, skip = 0 } = pagination;

      const queryBuilder = this.storeRepository.createQueryBuilder('store');
      const total = await queryBuilder.getCount();

      const stores: Store[] = await queryBuilder
        .select('store')
        .addSelect('city')
        .addSelect('region')
        .addSelect('district')
        .addSelect('storeBrand')
        .leftJoin('store.city', 'city')
        .leftJoin('store.region', 'region')
        .leftJoin('store.district', 'district')
        .leftJoin('store.storeBrand', 'storeBrand')
        .take(take)
        .skip(skip)
        .getMany();

      if (!stores) {
        throw new HttpException('Stores not found', HttpStatus.NOT_FOUND);
      }

      return { stores, total };
    }

    return [];
  }

  async getStoresByCityId(cityId: number): Promise<Store[]> {
    const store = await this.storeRepository.findBy({
      cityId,
      isActive: true,
    });

    if (!store) {
      throw new HttpException('Store not found', HttpStatus.NOT_FOUND);
    }
    return store;
  }
}
