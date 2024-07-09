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

  async setStoreStatus(token: string | any[], id: number): Promise<Store> {
    if (!token || typeof token !== 'string') {
      throw new HttpException('No access', HttpStatus.FORBIDDEN);
    }

    const store = await this.storeRepository.findOneBy({ id });
    if (!store) {
      throw new HttpException('Stores not found', HttpStatus.NOT_FOUND);
    }

    store.isActive = !store.isActive;

    return this.storeRepository.save(store);
  }

  async getActiveStores(
    token: string | any[],
    pagination: PaginationDto = {},
    orderBy: any = {},
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

      const queryBuilder = this.storeRepository.createQueryBuilder('stores');
      const total = await queryBuilder.getCount();

      queryBuilder
        .select('stores')
        .addSelect(`stores.name->'${lang}'`, 'langName')
        .addSelect('city')
        .addSelect('region')
        .addSelect('district')
        .addSelect('storeBrand')
        .leftJoin('stores.city', 'city')
        .leftJoin('stores.region', 'region')
        .leftJoin('stores.district', 'district')
        .leftJoin('stores.storeBrand', 'storeBrand');

      if (orderBy) {
        if (orderBy?.orderName) {
          // TODO: need find method how to orderBy JSON field
          // queryBuilder.orderBy(`stores.name->'${lang}'`, orderBy?.orderName);
        }

        if (orderBy?.isActive)
          queryBuilder.orderBy('stores.isActive', orderBy?.isActive);
      }

      queryBuilder.take(+take).skip(+skip);

      // console.log('SQL', queryBuilder.getQuery());

      const stores: Store[] = await queryBuilder.getMany();

      if (!stores) {
        throw new HttpException('Stores not found', HttpStatus.NOT_FOUND);
      }

      return {
        stores,
        pagination: { total, take, skip },
      };
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
