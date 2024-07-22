import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Discount } from './entities/discount.entity';
import { Repository } from 'typeorm';
import { CreateDiscount } from './dto/create-discount.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(Discount)
    private discountRepository: Repository<Discount>,
    private jwtService: JwtService,
  ) {}

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

    const discount = this.discountRepository.create(createDiscount);
    if (!discount) {
      throw new HttpException(
        `Can't create discount  with data: ${createDiscount}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    //TODO: add product by syncId to discount

    return discount;
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

  async getAllDiscountsForUser(lang: string = 'uk') {
    const discounts: Discount[] = await this.discountRepository.find({
      where: { isActive: true },
      relations: ['product_discounts', 'discounts_groups'],
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
    const discounts = await this.discountRepository.find();
    if (!discounts) {
      throw new HttpException('Discounts not found', HttpStatus.NOT_FOUND);
    }

    return discounts;
  }
}
