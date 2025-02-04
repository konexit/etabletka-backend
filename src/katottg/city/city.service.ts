import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from './entities/city.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Store } from 'src/stores/store/entities/store.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { In } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UpdateCity } from './dto/update-city.dto';

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
  ) { }

  cacheCitiesKey = 'cities';
  cacheDefaultCityKey = 'defaultCity';
  cacheCitiesTTL = 3600000; // 1Hour

  async update(
    token: string,
    id: number,
    updateCity: UpdateCity,
    lang: string = 'uk',
  ): Promise<City> {
    if (!token || typeof token !== 'string') {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const payload = await this.jwtService.decode(token);
    if (payload?.roleId !== 1) {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    delete updateCity.stores;

    await this.cityRepository.update(id, updateCity);
    const city = await this.cityRepository.findOne({
      where: { id },
      relations: ['stores'],
    });

    if (!city) {
      throw new HttpException(
        `Can't update city with data: ${updateCity}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    city.name = city.name[lang];
    if (city.prefix) city.prefix = city.prefix[lang];

    return city;
  }

  async getCities(token: string, lang: string = 'uk'): Promise<City[]> {
    if (!token || typeof token !== 'string') {
      return [];
    }

    const cities = await this.cityRepository.find({});

    if (!cities) {
      throw new HttpException('Cities not found', HttpStatus.NOT_FOUND);
    }

    for (const city of cities) {
      city.name = city.name[lang];
      if (city.prefix) city.prefix = city.prefix[lang];
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
    if (city.prefix) city.prefix = city.prefix[lang];

    await this.cacheManager.set(
      this.cacheDefaultCityKey,
      city,
      this.cacheCitiesTTL,
    );

    return city;
  }

  async getCityById(
    id: number,
    lang: string = 'uk',
  ): Promise<City | undefined> {
    const city = await this.cityRepository.findOne({
      where: { id },
      relations: ['stores'],
    });

    if (!city) {
      throw new HttpException('City not found', HttpStatus.NOT_FOUND);
    }

    city.name = city.name[lang];
    if (city.prefix) city.prefix = city.prefix[lang];

    return city;
  }

  async getCitiesWithStoresForUser(lang: string = 'uk') {
    const cacheCitiesWithStores = await this.cacheManager.get(
      this.cacheCitiesKey,
    );
    if (cacheCitiesWithStores) {
      return cacheCitiesWithStores;
    }

    const citiesWithStores = await this.citiesWithStores(lang);
    if (!citiesWithStores) {
      throw new HttpException('Cities not found', HttpStatus.NOT_FOUND);
    }

    await this.cacheManager.set(
      this.cacheCitiesKey,
      citiesWithStores,
      this.cacheCitiesTTL,
    );

    return await this.cacheManager.get(this.cacheCitiesKey);
  }

  async getCitiesWithStores(
    token: string,
    pagination: PaginationDto = {},
    orderBy: any = {},
    lang: string = 'uk',
  ): Promise<any> {
    if (!token || typeof token !== 'string') {
      return await this.getCitiesWithStoresForUser(lang);
    } else {
      const payload = await this.jwtService.decode(token);
      if (payload?.roleId !== 1) {
        return await this.getCitiesWithStoresForUser(lang);
      }

      const { take = 16, skip = 0 } = pagination;

      const storeCounts = await this.storeRepository
        .createQueryBuilder('stores')
        .select('stores.city_id', 'cityId')
        .addSelect('CAST(COUNT(stores.id) AS int)', 'storeCount')
        .groupBy('stores.city_id')
        .getRawMany();

      if (storeCounts.length === 0) {
        return {
          cities: [],
          pagination: { total: 0, take, skip },
        };
      }

      const cityIds = storeCounts.map((r) => r.cityId);
      if (cityIds) {
        const queryBuilder = this.cityRepository.createQueryBuilder('city');

        queryBuilder
          .select('city')
          .addSelect(`(city.name->'${lang}')::varchar`, 'langname')
          .addSelect(`(city.prefix->'${lang}')::varchar`, 'langprefix')
          .leftJoin('city.stores', 'stores')
          .where('city.id IN (:...ids)', { ids: cityIds });

        /** Order by statements **/
        if (orderBy) {
          if (orderBy?.orderName) {
            queryBuilder.orderBy(`langname`, orderBy?.orderName);
          }
        }

        queryBuilder.take(+take).skip(+skip);

        // console.log('SQL', queryBuilder.getQuery());

        const cities: City[] = await queryBuilder.getMany();
        if (!cities) {
          return {
            cities,
            pagination: { total: 0, take, skip },
          };
        }

        cities.forEach((city) => {
          city.name = city.name[lang];
          if (city.prefix) city.prefix = city.prefix[lang];

          city.storesCount =
            storeCounts.find((r) => r.cityId === city.id)?.storeCount || 0;
          if (city.stores) {
            for (const store of city.stores) {
              store.name = store.name[lang];
            }
          }
        });

        const total = await queryBuilder.getCount();

        return {
          cities,
          pagination: { total, take, skip },
        };
      }
    }

    return [];
  }

  async citiesWithStores(lang) {
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
        if (city.prefix) city.prefix = city.prefix[lang];

        city.storesCount =
          storeCounts.find((r) => r.cityId === city.id)?.storeCount || 0;
        if (city.stores) {
          for (const store of city.stores) {
            store.name = store.name[lang];
          }
        }
      });

      return citiesWithStores;
    }
  }
}
