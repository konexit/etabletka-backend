import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PaginationDto } from '../common/dto/paginationDto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private jwtService: JwtService,
  ) {}

  cacheActiveStoresKey = 'activeStores';
  cacheActiveStoresTTL = 3600000; // 1Hour

  async update(
    token: string,
    id: number,
    updateStore: UpdateStoreDto,
    lang: string = 'uk',
  ): Promise<any> {
    if (!token || typeof token !== 'string') {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const payload = await this.jwtService.decode(token);
    if (payload.roleId !== 1) {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    await this.storeRepository.update(id, updateStore);
    const store = await this.storeRepository.findOneBy({ id: id });
    if (!store) {
      throw new HttpException(
        `Can't update store with this data: ${updateStore}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    store.name = store.name[lang];
    return store;
  }

  async setStoreStatus(
    token: string,
    id: number,
    lang: string = 'uk',
  ): Promise<Store> {
    if (!token || typeof token !== 'string') {
      throw new HttpException('No access', HttpStatus.FORBIDDEN);
    }

    const store = await this.storeRepository.findOneBy({ id });
    if (!store) {
      throw new HttpException('Stores not found', HttpStatus.NOT_FOUND);
    }

    store.isActive = !store.isActive;
    store.name = store.name[lang];

    return this.storeRepository.save(store);
  }

  async getActiveStores(
    token: string,
    pagination: PaginationDto = {},
    orderBy: any = {},
    where: any = {},
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

      queryBuilder
        .select('stores')
        .addSelect(`(stores.name->'${lang}')::varchar`, 'langname')
        .addSelect('city')
        .addSelect('region')
        .addSelect('district')
        .addSelect('storeBrand')
        .leftJoin('stores.city', 'city')
        .leftJoin('stores.region', 'region')
        .leftJoin('stores.district', 'district')
        .leftJoin('stores.storeBrand', 'storeBrand')
        .where('stores.id is not null');

      /** Where statements **/
      if (where) {
        if (where.brandId) {
          queryBuilder.andWhere('stores.storeBrandId = :brandId', {
            brandId: where.brandId,
          });
        }
        if (where.regionId) {
          queryBuilder.andWhere('stores.regionId = :regionId', {
            regionId: where.regionId,
          });
        }
        if (where.isActive) {
          queryBuilder.andWhere('stores.isActive = :isActive', {
            isActive: where.isActive,
          });
        }
        if (where.sellType) {
          queryBuilder.andWhere('stores.sellType = :sellType', {
            sellType: where.sellType,
          });
        }
      }

      /** Order by statements **/
      if (orderBy) {
        if (orderBy?.orderName) {
          queryBuilder.orderBy(`langname`, orderBy?.orderName);
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

      const total = await queryBuilder.getCount();

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

  async getStoreById(
    token: string,
    id: number,
    lang: string = 'uk',
  ): Promise<Store> {
    const store = await this.storeRepository.findOneBy({
      id,
    });

    if (!store) {
      throw new HttpException('Store not found', HttpStatus.NOT_FOUND);
    }

    store.name = store.name[lang];

    return store;
  }
}
