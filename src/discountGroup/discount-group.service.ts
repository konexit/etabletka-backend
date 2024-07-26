import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiscountGroup } from './entities/discount-group.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateDiscountGroup } from './dto/create-discount-group.dto';
import { UpdateDiscountGroup } from './dto/update-discount-group.dto';

@Injectable()
export class DiscountGroupService {
  constructor(
    @InjectRepository(DiscountGroup)
    private discountGroupRepository: Repository<DiscountGroup>,
    private jwtService: JwtService,
  ) {}

  async create(
    token: string | any[],
    createDiscountGroup: CreateDiscountGroup,
  ) {
    if (!token || typeof token !== 'string') {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const payload = await this.jwtService.decode(token);
    if (payload.roleId !== 1) {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const discountGroup =
      this.discountGroupRepository.create(createDiscountGroup);
    if (!discountGroup) {
      throw new HttpException(
        `Can't create discount group with data: ${createDiscountGroup}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.discountGroupRepository.save(discountGroup);
  }

  async update(
    token: string | any[],
    id: number,
    updateDiscountGroup: UpdateDiscountGroup,
  ) {
    if (!token || typeof token !== 'string') {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const payload = await this.jwtService.decode(token);
    if (payload.roleId !== 1) {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    await this.discountGroupRepository.update(id, updateDiscountGroup);
    const discountGroup = await this.discountGroupRepository.findOneBy({
      id,
    });
    if (!discountGroup) {
      throw new HttpException(
        `Can't update discount group with data: ${updateDiscountGroup}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return discountGroup;
  }

  async setStatus(
    token: string | any[],
    id: number,
    lang: string = 'uk',
  ): Promise<DiscountGroup> {
    if (!token || typeof token !== 'string') {
      throw new HttpException('No access', HttpStatus.FORBIDDEN);
    }

    const payload = await this.jwtService.decode(token);
    if (payload.roleId !== 1) {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const discountGroup = await this.discountGroupRepository.findOne({
      where: { id },
    });
    if (!discountGroup) {
      throw new HttpException('Discount Group not found', HttpStatus.NOT_FOUND);
    }

    discountGroup.isActive = !discountGroup.isActive;
    await this.discountGroupRepository.save(discountGroup);

    const updDiscountGroup = await this.discountGroupRepository.findOne({
      where: { id },
      relations: ['discounts'],
    });
    updDiscountGroup.name = updDiscountGroup.name[lang];
    if (updDiscountGroup.discounts) {
      for (const discount of updDiscountGroup.discounts) {
        discount.name = discount.name[lang];
      }
    }

    return updDiscountGroup;
  }

  async getAllDiscountGroupsForUser(lang: string = 'uk') {
    const discountGroups = await this.discountGroupRepository.find({
      where: { isActive: true, discounts: { isActive: true } },
      relations: ['discounts'],
      order: {
        id: 'ASC',
      },
    });

    if (!discountGroups) {
      throw new HttpException(
        'Discount groups not found',
        HttpStatus.NOT_FOUND,
      );
    }

    for (const discountGroup of discountGroups) {
      discountGroup.name = discountGroup.name[lang];
      for (const discount of discountGroup.discounts) {
        discount.name = discount.name[lang];
      }
    }

    return discountGroups;
  }

  async getAllDiscountGroups(token: string | any[], lang: string = 'uk') {
    if (!token || typeof token !== 'string') {
      return await this.getAllDiscountGroupsForUser(lang);
    }

    const payload = await this.jwtService.decode(token);
    if (payload.roleId !== 1) {
      return await this.getAllDiscountGroupsForUser(lang);
    }

    /** Admin **/
    const discountGroups = await this.discountGroupRepository.find({
      relations: ['discounts'],
      order: {
        id: 'ASC',
      },
    });

    if (!discountGroups) {
      throw new HttpException(
        'Discount groups not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return discountGroups;
  }

  async getDiscountGroupById(
    token: string | any[],
    id: number,
    lang: string = 'uk',
  ): Promise<DiscountGroup> {
    const discountGroup = await this.discountGroupRepository.findOne({
      where: { id },
      relations: ['discounts'],
    });
    if (!discountGroup) {
      throw new HttpException(
        'Discount groups not found',
        HttpStatus.NOT_FOUND,
      );
    }

    discountGroup.name = discountGroup.name[lang];
    for (const discount of discountGroup.discounts) {
      discount.name = discount.name[lang];
    }

    return discountGroup;
  }
}
