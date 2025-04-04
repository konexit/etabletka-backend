import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from 'src/store/entities/store.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { In } from 'typeorm';
import { UpdateKatottgDto } from './dto/update-katottg.dto';
import { Katottg } from './entities/katottg.entity';
import { JwtPayload } from 'src/common/types/jwt/jwt.interfaces';
import { KATOTTG_VINNYTSIA } from 'src/common/config/common.constants';
import { USER_ROLE_JWT_ADMIN } from 'src/user/user.constants';

@Injectable()
export class KatottgService {
  constructor(
    @InjectRepository(Katottg)
    private katottgRepository: Repository<Katottg>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) { }

  cacheCitiesKey = 'cities';
  cacheDefaultCityKey = 'defaultCity';
  cacheCitiesTTL = 3600_000; // 1Hour

  async update(jwtPayload: JwtPayload, updateKatottg: UpdateKatottgDto, lang: string = 'uk'): Promise<Katottg> {
    if (!jwtPayload || !jwtPayload.roles || !jwtPayload.roles.includes(USER_ROLE_JWT_ADMIN)) {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const katottg = await this.katottgRepository.findOne({ where: { id: updateKatottg.id } });
    if (!katottg) {
      throw new HttpException(`katottg id: ${updateKatottg.id} not found`, HttpStatus.NOT_FOUND);
    }

    this.katottgRepository.merge(katottg, updateKatottg)

    await this.katottgRepository.save(katottg);

    const katottgWithStores = await this.katottgRepository.findOne({
      where: { id: updateKatottg.id },
      relations: ['stores'],
    });

    katottg.name = katottg.name[lang];
    if (katottg.prefix) {
      katottg.prefix = katottg.prefix[lang];
    }

    return katottgWithStores;
  }

  async getCities(jwtPayload: JwtPayload, lang: string = 'uk'): Promise<Katottg[]> {
    if (!jwtPayload) {
      return [];
    }

    const cities = await this.katottgRepository.find({});

    if (!cities) {
      throw new HttpException('Katottg not found', HttpStatus.NOT_FOUND);
    }

    for (const city of cities) {
      city.name = city.name[lang];
      if (city.prefix) {
        city.prefix = city.prefix[lang];
      }
    }

    return cities;
  }

  async getDefaultCity(lang: string = 'uk'): Promise<any> {
    const cacheDefaultCity = await this.cacheManager.get(this.cacheDefaultCityKey);
    if (cacheDefaultCity) {
      return cacheDefaultCity;
    }

    const city = await this.katottgRepository.findOneBy({ regDistCommSettlement: KATOTTG_VINNYTSIA });
    if (!city) {
      throw new HttpException('City not found', HttpStatus.NOT_FOUND);
    }

    city.name = city.name[lang];
    if (city.prefix) {
      city.prefix = city.prefix[lang];
    }

    await this.cacheManager.set(
      this.cacheDefaultCityKey,
      city,
      this.cacheCitiesTTL,
    );

    return city;
  }

  async getCityById(id: number, lang: string = 'uk'): Promise<Katottg | undefined> {
    const city = await this.katottgRepository.findOne({
      where: { id },
    });

    if (!city) {
      throw new HttpException('City not found', HttpStatus.NOT_FOUND);
    }

    city.name = city.name[lang];
    if (city.prefix) {
      city.prefix = city.prefix[lang];
    }

    return city;
  }

  async getCitiesWithStores(lang: string = 'uk'): Promise<Katottg[]> {
    const cacheCitiesWithStores = await this.cacheManager.get<Katottg[]>(this.cacheCitiesKey);
    if (cacheCitiesWithStores) {
      return cacheCitiesWithStores;
    }

    const citiesWithStores = await this.citiesWithStores(lang);
    if (!citiesWithStores.length) {
      throw new HttpException('Cities not found', HttpStatus.NOT_FOUND);
    }

    await this.cacheManager.set(this.cacheCitiesKey, citiesWithStores, this.cacheCitiesTTL);

    return citiesWithStores;
  }

  private async citiesWithStores(lang: string = 'uk'): Promise<Katottg[]> {
    const storeCounts = await this.storeRepository
      .createQueryBuilder('stores')
      .select('stores.katottg_id', 'katottgId')
      .addSelect('CAST(COUNT(stores.id) AS int)', 'storeCount')
      .where('stores.active=true')
      .groupBy('stores.katottg_id')
      .getRawMany();

    const cityIds = storeCounts.map((r) => r.katottgId);

    if (cityIds.length == 0) {
      return [];
    }

    const citiesWithStores = await this.katottgRepository.find({
      where: { id: In(cityIds) }
    });

    for (const city of citiesWithStores) {
      city.name = typeof city.name === 'object' ? city.name?.[lang] ?? city.name : city.name;

      if (city.prefix && typeof city.prefix === 'object') {
        city.prefix = city.prefix?.[lang] ?? city.prefix;
      }

      city.storesCount = storeCounts.find((r) => r.katottgId === city.id)?.storeCount || 0;

      if (city.stores) {
        for (const store of city.stores) {
          store.name = typeof store.name === 'object' ? store.name?.[lang] ?? store.name : store.name;
        }
      }
    }

    return citiesWithStores.sort((a, b) => b.storesCount - a.storesCount);
  }
}
