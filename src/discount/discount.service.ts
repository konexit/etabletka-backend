import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Discount } from './entities/discount.entity';
import { Repository } from 'typeorm';
import { CreateDiscount } from './dto/create-discount.dto';
import { JwtService } from '@nestjs/jwt';
import { DiscountGroup } from '../discountGroup/entities/discount-group.entity';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(Discount)
    private discountRepository: Repository<Discount>,
    @InjectRepository(DiscountGroup)
    private discountGroupRepository: Repository<DiscountGroup>,
    private jwtService: JwtService,
  ) {}

  async addDiscountGroup(discountGroups: [], discount: Discount) {
    // const discount: Discount = await this.discountRepository.findOneBy({
    //   id: discountId,
    // });
    if (discount) {
      for (const discountGroupId of discountGroups) {
        console.log('discountGroupId', discountGroupId);
        const discountGroup = await this.discountGroupRepository.findOne({
          where: { id: discountGroupId },
        });
        if (discountGroup) {
          discount.discountGroups.push(discountGroup);
          await this.discountRepository.save(discount);
        }
      }
    }
  }

  async create(
    token: string | any[],
    createDiscount: CreateDiscount,
  ): Promise<Discount> {
    if (!token || typeof token !== 'string') {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const payload = await this.jwtService.decode(token);
    if (payload.roleId !== 1) {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const discountData = this.discountRepository.create(createDiscount);
    if (!discountData) {
      throw new HttpException(
        `Can't create discount  with data: ${createDiscount}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const discount = await this.discountRepository.save(discountData);

    if (createDiscount.discountGroups) {
      await this.addDiscountGroup(createDiscount.discountGroups, discount);
    }

    return await this.discountRepository.findOne({
      where: { id: discount.id },
      relations: ['discountGroups'],
    });
  }

  async update(token: string | any[]) {
    if (!token || typeof token !== 'string') {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const payload = await this.jwtService.decode(token);
    if (payload.roleId !== 1) {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }
  }

  async setStatus(
    token: string | any[],
    id: number,
    lang: string = 'uk',
  ): Promise<Discount> {
    if (!token || typeof token !== 'string') {
      throw new HttpException('No access', HttpStatus.FORBIDDEN);
    }

    const payload = await this.jwtService.decode(token);
    if (payload.roleId !== 1) {
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
      relations: ['discountGroups', 'products'],
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
      relations: ['discountGroups'],
    });

    for (const discount of discounts) {
      discount.name = discount.name[lang];
    }

    return discounts;
  }

  async getAllDiscounts(token: string | any[], lang: string = 'uk') {
    if (!token || typeof token !== 'string') {
      return await this.getAllDiscountsForUser(lang);
    }

    const payload = await this.jwtService.decode(token);
    if (payload.roleId !== 1) {
      return await this.getAllDiscountsForUser(lang);
    }

    /** Admin **/
    const discounts: Discount[] = await this.discountRepository.find({
      relations: ['discountGroups', 'products'],
    });
    if (!discounts) {
      throw new HttpException('Discounts not found', HttpStatus.NOT_FOUND);
    }

    return discounts;
  }

  async getDiscountById(
    token: string | any[],
    id: number,
    lang: string = 'uk',
  ) {
    const discount = await this.discountRepository.findOne({
      where: { id },
      relations: ['discountGroups'],
    });
    if (!discount) {
      throw new HttpException('Discount not found', HttpStatus.NOT_FOUND);
    }

    discount.name = discount.name[lang];

    return discount;
  }
}
