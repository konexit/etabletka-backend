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
        `Can't create discount group point with data: ${createDiscountGroup}`,
        HttpStatus.BAD_REQUEST,
      );
    }
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

  async getAllDiscountGroupsForUser(lang: string = 'uk') {
    const discountGroups = await this.discountGroupRepository.find({
      where: { isActive: true },
    });

    if (!discountGroups) {
      return [];
    }

    for (const discountGroup of discountGroups) {
      discountGroup.name = discountGroup.name[lang];
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
    const discountGroups = await this.discountGroupRepository.find();

    if (!discountGroups) {
      return [];
    }

    return discountGroups;
  }
}
