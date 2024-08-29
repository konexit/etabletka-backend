import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductGroup } from './entities/product-group.entity';
import { In, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateProductGroup } from './dto/create-product-group.dto';
import { UpdateProductGroup } from './dto/update-product-group.dto';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class ProductGroupService {
  constructor(
    @InjectRepository(ProductGroup)
    private productGroupRepository: Repository<ProductGroup>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private jwtService: JwtService,
  ) {}

  async addProducts(ids: Array<number>) {
    return await this.productRepository.find({
      where: { syncId: In(ids) },
    });
  }

  async create(token: string, createProductGroup: CreateProductGroup) {
    if (!token || typeof token !== 'string') {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const payload = await this.jwtService.decode(token);
    if (payload?.roleId !== 1) {
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

    if (createProductGroup.products) {
      const ids: Array<number> = String(createProductGroup.products)
        .split(',')
        .map(Number);

      productGroup.products = await this.addProducts(ids);
    }

    const productGroupUpd: ProductGroup =
      await this.productGroupRepository.save(productGroup);
    return await this.productGroupRepository.findOne({
      where: { id: productGroupUpd.id },
      relations: ['products'],
    });
  }

  async update(
    token: string,
    id: number,
    updateProductGroup: UpdateProductGroup,
  ) {
    if (!token || typeof token !== 'string') {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const payload = await this.jwtService.decode(token);
    if (payload?.roleId !== 1) {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const productIds = updateProductGroup.products;
    delete updateProductGroup['products'];

    await this.productGroupRepository.update(id, updateProductGroup);
    const productGroup: ProductGroup =
      await this.productGroupRepository.findOne({
        where: { id },
        relations: ['products'],
      });
    if (!productGroup) {
      throw new HttpException(
        `Can't update product group with data: ${updateProductGroup}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (productIds) {
      if (!Array.isArray(productIds)) {
        const ids: Array<number> = String(productIds).split(',').map(Number);

        console.log('ProductIds', ids);
        productGroup.products = await this.addProducts(ids);
      } else {
        productGroup.products = await this.addProducts(productIds);
      }
    } else {
      productGroup.products = [];
    }

    const productGroupUpd: ProductGroup =
      await this.productGroupRepository.save(productGroup);

    return await this.productGroupRepository.findOne({
      where: { id: productGroupUpd.id },
      relations: ['products'],
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
      relations: ['products'],
    });

    if (!productGroups) return [];

    return productGroups;
  }

  async getProductGroupById(id) {
    const productGroup = await this.productGroupRepository.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!productGroup) {
      throw new HttpException('Can`t get product group', HttpStatus.NOT_FOUND);
    }
    return productGroup;
  }
}
