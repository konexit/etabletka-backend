import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { In, Repository } from 'typeorm';
import { UpdateStoreDto } from './dto/update-store.dto';
import { JwtPayload } from 'src/common/types/jwt/jwt.interfaces';
import { OptionsStoreDto } from './dto/options-store.dto';
import { ROLE_JWT_ADMIN } from 'src/users/role/user-role.constants';
import { Stores } from 'src/common/types/store/store';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
  ) {}

  async update(
    jwtPayload: JwtPayload,
    id: number,
    updateStore: UpdateStoreDto,
    lang: string = 'uk',
  ): Promise<any> {
    if (
      !jwtPayload ||
      !jwtPayload.roles ||
      !jwtPayload.roles.includes(ROLE_JWT_ADMIN)
    ) {
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

  async getStores(lang: string = 'uk'): Promise<Store[]> {
    const stores = await this.storeRepository.find({});

    for (const store of stores) {
      store.name = store.name[lang];
    }

    return stores;
  }

  async getStoresByOptions(jwtPayload: JwtPayload, optionsStoreDto: OptionsStoreDto): Promise<General.Page<Store>> {
    const { pagination = {}, lang = 'uk', where = {}, orderBy = {} } = optionsStoreDto;
    const { take = 16, skip = 0 } = pagination;

    const queryBuilder = this.storeRepository
      .createQueryBuilder('stores')
      .select('stores');

    if (where?.isActive !== undefined) {
      queryBuilder.andWhere('stores.isActive = :isActive', {
        isActive: where.isActive,
      });
    }

    if (orderBy) {
      if (orderBy.name) {
        queryBuilder.orderBy(`stores.name->>'${lang}'`, orderBy.name);
      }
    }

    queryBuilder.limit(take).offset(skip);

    const stores: Store[] = await queryBuilder.getMany();

    if (!stores.length) {
      throw new HttpException('Stores not found', HttpStatus.NOT_FOUND);
    }

    for (const store of stores) {
      store.name = store.name[lang] ?? '';
    }

    return {
      items: stores,
      pagination: {
        total: await queryBuilder.getCount(),
        take,
        skip,
      },
    };
  }

  async getStoresByKatottgId(
    id: number,
    lang: string = 'uk',
  ): Promise<Store[]> {
    const stores = await this.storeRepository.findBy({
      katottgId: id,
      isActive: true,
    });

    for (const store of stores) {
      store.name = store.name[lang] ?? '';
    }

    if (!stores.length) {
      throw new HttpException('Stores not found', HttpStatus.NOT_FOUND);
    }
    return stores;
  }

  async getStoresByIds(
    ids: Store['id'][],
    lang = 'uk',
  ): Promise<Store[]> {
    const stores = await this.storeRepository.findBy({
      id: In(ids),
      isActive: true,
    });

    for (const store of stores) {
      store.name = store.name[lang] ?? '';
    }

    if (!stores.length) {
      throw new HttpException('Stores not found', HttpStatus.NOT_FOUND);
    }

    return stores;
  }

  async getStoreById(id: number, lang: string = 'uk'): Promise<Store> {
    const store = await this.storeRepository.findOne({
      where: { id },
      relations: ['company'],
    });

    if (!store) {
      throw new HttpException('Store not found', HttpStatus.NOT_FOUND);
    }

    store.name = store.name[lang];

    return store;
  }

  async getStoreByIds(ids: number[] = [], lang: string = 'uk'): Promise<Store[]> {
    const stores = await this.storeRepository.find({
      where: { id: In(ids) }
    });

    if (!stores) {
      throw new HttpException('Stores not found', HttpStatus.NOT_FOUND);
    }

    for (const store of stores) {
      store.name = store.name[lang] ?? '';
    }

    return stores;
  }

  async getCoords(): Promise<Stores.Coorditates[]> {
    const stores = await this.storeRepository
      .createQueryBuilder('store')
      .leftJoinAndSelect('store.company', 'company')
      .select(['store.id', 'store.lat', 'store.lng', 'company.cdnData'])
      .getRawMany();

    return stores.map((item) => ({
      id: item.store_id,
      lat: item.store_lat,
      lng: item.store_lng,
      icon: item?.company_cdn_data?.url ?? '',
    }));
  }
}
