import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { FormatCategoryMenuDto } from './dto/format-category.menu.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  cacheMenuKey = 'menu';
  cacheMenuTTL = 60000;

  create(createCategoryDto: CreateCategoryDto) {
    return 'This action adds a new category';
  }

  async formatMenu(depth: number = 3): Promise<FormatCategoryMenuDto[]> {
    const cacheCategoryMenu = await this.cacheManager.get(this.cacheMenuKey);
    if (cacheCategoryMenu) return <FormatCategoryMenuDto[]>cacheCategoryMenu;
    const categories = await this.categoryRepository.find({
      where: { active: true },
      order: {
        position: 'ASC',
      },
      relations: ['products'],
    });
    const categoryMenu = this.buildMenuTree(categories, depth, 'uk');
    await this.cacheManager.set(
      this.cacheMenuKey,
      categoryMenu,
      this.cacheMenuTTL,
    );
    return categoryMenu;
  }

  async findAll() {
    return await this.categoryRepository.find();
  }

  async findByRoot(): Promise<Category[]> {
    return await this.categoryRepository.find({
      where: { root: true, active: true },
    });
  }

  async findById(id: number): Promise<Category> {
    return await this.categoryRepository.findOneBy({ id });
  }

  async findByParentId(id: number): Promise<Category[]> {
    const { lft, rgt } = await this.categoryRepository.findOne({
      where: { id },
      select: ['lft', 'rgt'],
    });
    return await this.categoryRepository.find({
      where: {
        active: true,
        lft: MoreThanOrEqual(lft),
        rgt: LessThanOrEqual(rgt),
      },
      order: {
        position: 'ASC',
      },
    });
  }

  async findBySlug(slug: string): Promise<Category> {
    return await this.categoryRepository.findOneBy({ slug, active: true });
  }

  async findByPath(path: string): Promise<Category> {
    return await this.categoryRepository.findOneBy({ path, active: true });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }

  private buildMenuTree(
    categories: Category[],
    depth: number,
    lang: string,
  ): FormatCategoryMenuDto[] {
    const idMap: Map<number, FormatCategoryMenuDto> = new Map();
    const rootNodes: FormatCategoryMenuDto[] = [];

    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      const formatCategoryMenuDto = new FormatCategoryMenuDto();
      formatCategoryMenuDto.id = category.id;
      formatCategoryMenuDto.depth = 1;
      formatCategoryMenuDto.name = category.name[lang];
      formatCategoryMenuDto.path = category.path;
      formatCategoryMenuDto.alt = category.alt;
      formatCategoryMenuDto.cdnIcon = category.cdnIcon;
      formatCategoryMenuDto.children = [];
      formatCategoryMenuDto.hasProducts = category?.products.length > 0;
      idMap.set(category.id, formatCategoryMenuDto);
    }

    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      const node = idMap.get(category.id);
      if (category.parentId) {
        const parentNode = idMap.get(category.parentId);
        if (parentNode) {
          node.depth = parentNode.depth + 1;
          if (node.depth > depth) continue;
          parentNode.children.push(node);
        }
      } else {
        rootNodes.push(node);
      }
    }

    return rootNodes;
  }
}
