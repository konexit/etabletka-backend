import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Discount } from './entities/discount.entity';
import { In, Repository } from 'typeorm';
import { CreateDiscount } from './dto/create-discount.dto';
import { JwtService } from '@nestjs/jwt';
import { DiscountGroup } from '../discount-group/entities/discount-group.entity';
import { Product } from 'src/products/product/entities/product.entity';
import { UpdateDiscount } from './dto/update-discount.dto';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(Discount)
    private discountRepository: Repository<Discount>,
    @InjectRepository(DiscountGroup)
    private discountGroupRepository: Repository<DiscountGroup>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private jwtService: JwtService,
  ) {}

  async addDiscountGroup(ids: Array<number>) {
    return await this.discountGroupRepository.find({
      where: { id: In(ids) },
    });
  }

  async addDiscountProducts(ids: Array<number>) {
    return await this.productRepository.find({
      where: { syncId: In(ids) },
    });
  }

  async create(
    token: string,
    createDiscount: CreateDiscount,
  ): Promise<Discount> {
    if (!token || typeof token !== 'string') {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const payload = await this.jwtService.decode(token);
    if (payload?.roleId !== 1) {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const discount = this.discountRepository.create(createDiscount);
    if (!discount) {
      throw new HttpException(
        `Can't create discount  with data: ${createDiscount}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (createDiscount.discountGroups) {
      const ids: Array<number> = String(createDiscount.discountGroups)
        .split(',')
        .map(Number);

      discount.discountGroups = await this.addDiscountGroup(ids);
    }

    if (createDiscount.products) {
      const ids: Array<number> = String(createDiscount.products)
        .split(',')
        .map(Number);

      discount.products = await this.addDiscountProducts(ids);
    }

    const discountUpd: Discount = await this.discountRepository.save(discount);
    return await this.discountRepository.findOne({
      where: { id: discountUpd.id },
      relations: ['discountGroups', 'products', 'products.categories'],
    });
  }

  async update(
    token: string,
    id: number,
    updateDiscount: UpdateDiscount,
  ) {
    if (!token || typeof token !== 'string') {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const payload = await this.jwtService.decode(token);
    if (payload?.roleId !== 1) {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const discountGroupIds = updateDiscount.discountGroups;
    delete updateDiscount['discountGroups'];

    const discountProductIds = updateDiscount.products;
    delete updateDiscount['products'];

    await this.discountRepository.update(id, updateDiscount);
    const discount: Discount = await this.discountRepository.findOne({
      where: { id: id },
      relations: ['discountGroups', 'products', 'products.categories'],
    });
    if (!discount) {
      throw new HttpException(
        `Can't update discount with data: ${updateDiscount}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (discountGroupIds) {
      if (!Array.isArray(discountGroupIds)) {
        const ids: Array<number> = String(discountGroupIds)
          .split(',')
          .map(Number);

        console.log('GroupIds', ids);
        discount.discountGroups = await this.addDiscountGroup(ids);
      } else {
        discount.discountGroups = await this.addDiscountGroup(discountGroupIds);
      }
    } else {
      discount.discountGroups = [];
    }

    if (discountProductIds) {
      if (!Array.isArray(discountProductIds)) {
        const ids: Array<number> = String(discountProductIds)
          .split(',')
          .map(Number);

        console.log('ProductIds', ids);
        discount.products = await this.addDiscountProducts(ids);
      } else {
        discount.products = await this.addDiscountProducts(discountProductIds);
      }
    } else {
      discount.products = [];
    }

    const discountUpd: Discount = await this.discountRepository.save(discount);
    return await this.discountRepository.findOne({
      where: { id: discountUpd.id },
      relations: ['discountGroups', 'products', 'products.categories'],
    });
  }

  async delete(token: string, id: number) {
    if (!token || typeof token !== 'string') {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const payload = await this.jwtService.decode(token);
    if (payload?.roleId !== 1) {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const discount: Discount = await this.discountRepository.findOne({
      where: { id: id },
      relations: ['discountGroups', 'products', 'products.categories'],
    });
    if (!discount) {
      throw new HttpException(`Can\`t delete discount`, HttpStatus.BAD_REQUEST);
    }

    discount.discountGroups = [];
    discount.products = [];
    await this.discountRepository.save(discount);

    return await this.discountRepository.delete(id);
  }

  async setStatus(
    token: string,
    id: number,
    lang: string = 'uk',
  ): Promise<Discount> {
    if (!token || typeof token !== 'string') {
      throw new HttpException('No access', HttpStatus.FORBIDDEN);
    }

    const payload = await this.jwtService.decode(token);
    if (payload?.roleId !== 1) {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const discount = await this.discountRepository.findOne({
      where: { id },
    });
    if (!discount) {
      throw new HttpException('Discount not found', HttpStatus.NOT_FOUND);
    }

    discount.isActive = !discount.isActive;
    await this.discountRepository.save(discount);

    const updDiscount = await this.discountRepository.findOne({
      where: { id },
      relations: ['discountGroups', 'products', 'products.categories'],
    });

    updDiscount.name = updDiscount.name[lang];
    if (updDiscount.discountGroups) {
      for (const discountGroup of updDiscount.discountGroups) {
        discountGroup.name = discountGroup.name[lang];
      }
    }
    if (updDiscount.products) {
      for (const product of updDiscount.products) {
        product.name = product.name[lang];
      }
    }

    return updDiscount;
  }

  async getAllDiscountsForUser(lang: string = 'uk') {
    const discounts: Discount[] = await this.discountRepository.find({
      where: { isActive: true },
      relations: ['discountGroups', 'products', 'products.categories'],
    });

    for (const discount of discounts) {
      discount.name = discount.name[lang];
      for (const discountGroup of discount.discountGroups) {
        discountGroup.name = discountGroup.name[lang];
      }
      for (const product of discount.products) {
        product.name = product.name[lang];
        if (product.shortName) product.shortName = product.shortName[lang];
      }
    }

    return discounts;
  }

  async getAllDiscounts(token: string, lang: string = 'uk') {
    if (!token || typeof token !== 'string') {
      return await this.getAllDiscountsForUser(lang);
    }

    const payload = await this.jwtService.decode(token);
    if (payload?.roleId !== 1) {
      return await this.getAllDiscountsForUser(lang);
    }

    /** Admin **/
    const discounts: Discount[] = await this.discountRepository.find({
      relations: ['discountGroups', 'products', 'products.categories'],
    });
    if (!discounts) {
      throw new HttpException('Discounts not found', HttpStatus.NOT_FOUND);
    }

    return discounts;
  }

  async getDiscountById(
    token: string,
    id: number,
    lang: string = 'uk',
  ) {
    const discount = await this.discountRepository.findOne({
      where: { id },
      relations: ['discountGroups', 'products', 'products.categories'],
    });
    if (!discount) {
      throw new HttpException('Discount not found', HttpStatus.NOT_FOUND);
    }

    discount.name = discount.name[lang];
    for (const discountGroup of discount.discountGroups) {
      discountGroup.name = discountGroup.name[lang];
    }
    for (const product of discount.products) {
      product.name = product.name[lang];
      if (product.shortName) product.shortName = product.shortName[lang];
    }

    return discount;
  }
}
