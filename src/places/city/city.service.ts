import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from './entities/city.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Store } from '../../store/entities/store.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { In } from 'typeorm';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City)
    private cityRepository: Repository<City>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private jwtService: JwtService,
  ) {}

  cacheCitiesKey = 'cities';
  cacheCitiesTTL = 3600000; // 1Hour

  async getCities(token: string | any[]): Promise<City[]> {
    if (!token || typeof token !== 'string') {
      return [];
    }

    return await this.cityRepository.find({});
  }

  async getCityById(id: number): Promise<City | undefined> {
    return await this.cityRepository.findOneBy({ id });
  }

  async getCitiesWithStores(): Promise<any> {
    const cacheCitiesWithStores = await this.cacheManager.get(
      this.cacheCitiesKey,
    );
    if (cacheCitiesWithStores) {
      return cacheCitiesWithStores;
    }

    const storeCounts = await this.storeRepository
      .createQueryBuilder('stores')
      .select('stores.city_id', 'cityId')
      .addSelect('CAST(COUNT(stores.id) AS int)', 'storeCount')
      .groupBy('stores.city_id')
      .getRawMany();

    const cityIds = storeCounts.map((r) => r.cityId);

    if (cityIds) {
      const citiesWithStores = await this.cityRepository.find({
        where: { id: In(cityIds) },
        relations: ['stores'],
      });

      citiesWithStores.forEach((city) => {
        city.storesCount =
          storeCounts.find((r) => r.cityId === city.id)?.storeCount || 0;
      });

      await this.cacheManager.set(
        this.cacheCitiesKey,
        citiesWithStores,
        this.cacheCitiesTTL,
      );

      return citiesWithStores;
    }

    return [];
  }
}
