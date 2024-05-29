import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    return 'This action adds a new category';
  }

  async findAll() {
    return await this.categoryRepository.find();
  }

  async findByRoot() {
    return await this.categoryRepository.find({ where: { root: true } });
  }

  async findById(id: number) {
    return await this.categoryRepository.findOneBy({ id });
  }

  async findByParentId(id: number): Promise<Category[]> {
    const { lft, rgt } = await this.categoryRepository.findOne({
      where: { id },
      select: ['lft', 'rgt'],
    });
    return await this.categoryRepository.find({
      where: {
        lft: MoreThanOrEqual(lft),
        rgt: LessThanOrEqual(rgt),
      },
    })
  }

  async findBySlug(slug: string) {
    return await this.categoryRepository.findOneBy({ slug });
  }

  async findByPath(path: string) {
    return await this.categoryRepository.findOneBy({ path });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
