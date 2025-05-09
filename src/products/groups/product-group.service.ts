import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductGroup } from './entities/product-group.entity';
import { Repository } from 'typeorm';
import { CreateProductGroupDto } from './dto/create-product-group.dto';
import { UpdateProductGroupDto } from './dto/update-product-group.dto';
import { ProductGroupPage } from './product-group.interface';

@Injectable()
export class ProductGroupService {
  constructor(
    @InjectRepository(ProductGroup)
    private productGroupRepository: Repository<ProductGroup>
  ) { }

  async createProductGroup(createProductGroupDto: CreateProductGroupDto): Promise<ProductGroup> {
    const newProductGroup = this.productGroupRepository.create(createProductGroupDto);
    if (!newProductGroup) {
      throw new HttpException(
        `Can't create product group with data: ${createProductGroupDto}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.productGroupRepository.save(newProductGroup);
  }

  async patchProductGroup(id: ProductGroup['id'], updateProductGroupDto: UpdateProductGroupDto): Promise<ProductGroup> {
    await this.productGroupRepository.update(id, updateProductGroupDto);

    const productGroup: ProductGroup = await this.productGroupRepository.findOne({ where: { id } });
    if (!productGroup) {
      throw new HttpException(`Can't update product groups`, HttpStatus.BAD_REQUEST);
    }

    return productGroup;
  }

  async findAll(): Promise<ProductGroup[]> {
    const productGroups = await this.productGroupRepository.find({ order: { id: 'ASC' } });

    if (!productGroups)
      throw new HttpException('Product groups not found', HttpStatus.NOT_FOUND);

    return productGroups;
  }

  async getProductGroupBySlug(slug: ProductGroup['slug'], lang = 'uk'): Promise<ProductGroupPage> {
    const productGroup = await this.productGroupRepository.findOne({
      select: ['id', 'name', 'slug'],
      where: { slug }
    });

    if (!productGroup) {
      throw new HttpException('Can`t get product group', HttpStatus.NOT_FOUND);
    }

    return {
      breadcrumbs: [],
      content: {
        id: productGroup.id,
        name: productGroup.name[lang],
        slug: productGroup.slug
      }
    };
  }
}
