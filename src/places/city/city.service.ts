import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
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
  cacheDefaultCityKey = 'defaultCity';
  cacheCitiesTTL = 3600000; // 1Hour

  async getCities(token: string | any[]): Promise<City[]> {
    if (!token || typeof token !== 'string') {
      return [];
    }

    const cities = await this.cityRepository.find({});

    if (!cities) {
      throw new HttpException('Cities not found', HttpStatus.NOT_FOUND);
    }

    return cities;
  }

  async getDefaultCity(lang: string = 'uk'): Promise<any> {
    const cacheDefaultCity = await this.cacheManager.get(
      this.cacheDefaultCityKey,
    );
    if (cacheDefaultCity) {
      return cacheDefaultCity;
    }

    const city = await this.cityRepository.findOneBy({ id: 29273 });

    if (!city) {
      throw new HttpException('City not found', HttpStatus.NOT_FOUND);
    }

    city.name = city.name[lang];

    await this.cacheManager.set(
      this.cacheDefaultCityKey,
      city,
      this.cacheCitiesTTL,
    );

    return city;
  }

  async getCityById(id: number): Promise<City | undefined> {
    const city = await this.cityRepository.findOneBy({ id });

    if (!city) {
      throw new HttpException('City not found', HttpStatus.NOT_FOUND);
    }

    return city;
  }

  async getCitiesWithStores(lang: string = 'uk'): Promise<any> {
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
        city.name = city.name[lang];
        city.storesCount =
          storeCounts.find((r) => r.cityId === city.id)?.storeCount || 0;
        if (city.stores) {
          for (const store of city.stores) {
            store.name = store.name[lang];
          }
        }
      });

      if (!citiesWithStores) {
        throw new HttpException('Cities not found', HttpStatus.NOT_FOUND);
      }

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
