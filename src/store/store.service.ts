import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { Repository } from 'typeorm';
import { UpdateStoreDto } from './dto/update-store.dto';
import { JwtPayload } from 'src/common/types/jwt/jwt.interfaces';
import { OptionsStoreDto } from './dto/options-store.dto';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>
  ) { }

  async update(
    token: string,
    id: number,
    updateStore: UpdateStoreDto,
    lang: string = 'uk',
  ): Promise<any> {
    if (!token || typeof token !== 'string') {
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

  async getStoresByOptions(jwtPayload: JwtPayload, optionsStoreDto: OptionsStoreDto): Promise<any> {
    const { pagination = {}, lang = 'uk', where = {}, orderBy = {} } = optionsStoreDto;
    const { take = 16, skip = 0 } = pagination;

    const queryBuilder = this.storeRepository
      .createQueryBuilder('stores')
      .select('stores')
      .addSelect(`stores.name->>'${lang}'`, 'langname')
      .addSelect('company')
      .leftJoin('stores.company', 'company')
      .where('stores.id is not null');

    if (where?.isActive !== undefined) {
      queryBuilder.andWhere('stores.isActive = :isActive', { isActive: where.isActive });
    }

    if (orderBy) {
      if (orderBy.name) {
        queryBuilder.orderBy(`langname`, orderBy.name);
      }
    }

    queryBuilder.limit(take).offset(skip);

    const stores: Store[] = await queryBuilder.getMany();

    if (!stores.length) {
      throw new HttpException('Stores not found', HttpStatus.NOT_FOUND);
    }

    return {
      stores,
      pagination: {
        total: await queryBuilder.getCount(),
        take,
        skip,
      },
    };
  }

  async getStoresByCityId(cityId: number): Promise<Store[]> {
    const store = await this.storeRepository.findBy({
      katottgId: cityId,
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
