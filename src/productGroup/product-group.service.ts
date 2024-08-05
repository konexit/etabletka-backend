import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductGroup } from './entities/product-group.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateProductGroup } from './dto/create-product-group.dto';
import { UpdateProductGroup } from './dto/update-product-group.dto';

@Injectable()
export class ProductGroupService {
  constructor(
    @InjectRepository(ProductGroup)
    private productGroupRepository: Repository<ProductGroup>,
    private jwtService: JwtService,
  ) {}

  async create(token: string | any[], createProductGroup: CreateProductGroup) {
    if (!token || typeof token !== 'string') {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const payload = await this.jwtService.decode(token);
    if (payload.roleId !== 1) {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const productGroup: ProductGroup =
      this.productGroupRepository.create(createProductGroup);
    if (!productGroup) {
      throw new HttpException(
        `Can't create product group with data: ${createProductGroup}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.productGroupRepository.save(productGroup);
  }

  async update(
    token: string | any[],
    id: number,
    updateProductGroup: UpdateProductGroup,
  ) {
    if (!token || typeof token !== 'string') {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const payload = await this.jwtService.decode(token);
    if (payload.roleId !== 1) {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    await this.productGroupRepository.update(id, updateProductGroup);
    const productGroup: ProductGroup =
      await this.productGroupRepository.findOneBy({
        id,
      });
    if (!productGroup) {
      throw new HttpException(
        `Can't update product group with data: ${updateProductGroup}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return productGroup;
  }

  async delete(token: string | any[], id: number) {
    if (!token || typeof token !== 'string') {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const payload = await this.jwtService.decode(token);
    if (payload.roleId !== 1) {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const productGroup: ProductGroup =
      await this.productGroupRepository.findOneBy({
        id,
      });
    if (!productGroup) {
      throw new HttpException(
        `Can't find product group with ID: ${id}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    //TODO: delete ? all if it's a root and remove products from this group
  }

  async getProductGroups() {
    const productGroups = await this.productGroupRepository.find({
      order: { id: 'ASC' },
    });

    if (!productGroups) return [];

    return productGroups;
  }
}
