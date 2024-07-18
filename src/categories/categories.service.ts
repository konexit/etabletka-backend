import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, LessThanOrEqual, Not } from 'typeorm';
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
  ) { }

  cacheMenuKey = 'menu';
  cacheMenuTTL = 60000;

  create(createCategoryDto: CreateCategoryDto) {
    return 'This action adds a new category';
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }

  async formatMenu(depth: number = 3): Promise<FormatCategoryMenuDto[]> {
    const cacheCategoryMenu = await this.cacheManager.get(this.cacheMenuKey);
    if (cacheCategoryMenu) return <FormatCategoryMenuDto[]>cacheCategoryMenu;
    const categories = await this.categoryRepository.find({
      where: { active: true },
      order: {
        position: 'ASC',
      },
    });
    const categoryMenu = this.buildMenuTree(categories, depth, 'uk');
    await this.cacheManager.set(
      this.cacheMenuKey,
      categoryMenu,
      this.cacheMenuTTL,
    );
    return categoryMenu;
  }

  async formatMenuRoot(lang: string = 'uk'): Promise<FormatCategoryMenuDto[]> {
    const resultMenu: FormatCategoryMenuDto[] = [];
    const rootCategories: Category[] = await this.findByRoot();
    for (let i = 0; i < rootCategories.length; i++) {
      const formatCategory = new FormatCategoryMenuDto();
      formatCategory.id = rootCategories[i].id;
      formatCategory.name = rootCategories[i].name[lang];
      formatCategory.path = rootCategories[i].path;
      formatCategory.cdnIcon = rootCategories[i].cdnIcon;
      formatCategory.cdnData = rootCategories[i].cdnData;
      formatCategory.alt = rootCategories[i].alt;
      formatCategory.root = rootCategories[i].root;
      formatCategory.lft = rootCategories[i].lft;
      formatCategory.rgt = rootCategories[i].rgt;
      formatCategory.children = [];
      resultMenu.push(formatCategory);
    }
    return resultMenu;
  }

  async findAll() {
    return await this.categoryRepository.find();
  }

  async findByRoot(): Promise<Category[]> {
    return await this.categoryRepository.find({
      where: { root: true, active: true },
      order: {
        position: 'ASC',
      },
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

  async findBySlug(slug: string): Promise<any> {
    return await this.categoryRepository.findOneBy({ slug, active: true });
  }

  async findByPath(
    path: string,
    lang: string = 'uk',
  ): Promise<{
    formatCategory: FormatCategoryMenuDto;
    idMap: Map<number, FormatCategoryMenuDto>;
  }> {
    const idMap: Map<number, FormatCategoryMenuDto> = new Map();
    const category = await this.categoryRepository.findOneBy({
      path,
      active: true,
    });

    if (!category) {
      throw new HttpException('Category not found', HttpStatus.BAD_REQUEST);
    }

    const formatCategory = new FormatCategoryMenuDto();
    formatCategory.id = category.id;
    formatCategory.depth = 1;
    formatCategory.name = category.name[lang];
    formatCategory.path = category.path;
    formatCategory.cdnIcon = category.cdnIcon;
    formatCategory.cdnData = category.cdnData;
    formatCategory.alt = category.alt;
    formatCategory.root = category.root;
    formatCategory.lft = category.lft;
    formatCategory.rgt = category.rgt;

    const categories = await this.categoryRepository.find({
      where: {
        lft: MoreThanOrEqual(category.lft),
        rgt: LessThanOrEqual(category.rgt),
        active: true,
        id: Not(category.id),
      },
    });

    this.formatModel(categories, idMap, lang);

    return { formatCategory, idMap };
  }

  private buildMenuTree(
    categories: Category[],
    depth: number,
    lang: string,
    fromCategory: Category = null,
  ): FormatCategoryMenuDto[] {
    const idMap: Map<number, FormatCategoryMenuDto> = new Map();
    const rootNodes: FormatCategoryMenuDto[] = [];

    this.formatModel(categories, idMap, lang);

    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      const node = idMap.get(category.id);
      if (
        fromCategory &&
        !fromCategory.root &&
        category.id === fromCategory.id
      ) {
        category.parentId = null;
      }
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

  private formatModel(
    categories: Category[],
    idMap: Map<number, FormatCategoryMenuDto>,
    lang: string = 'uk',
  ) {
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      const formatCategoryMenuDto = new FormatCategoryMenuDto();
      formatCategoryMenuDto.id = category.id;
      formatCategoryMenuDto.depth = 1;
      formatCategoryMenuDto.name = category.name[lang];
      formatCategoryMenuDto.path = category.path;
      formatCategoryMenuDto.alt = category.alt;
      formatCategoryMenuDto.cdnIcon = category.cdnIcon;
      formatCategoryMenuDto.cdnData = category.cdnData;
      formatCategoryMenuDto.lft = category.lft;
      formatCategoryMenuDto.rgt = category.rgt;
      formatCategoryMenuDto.children = [];
      idMap.set(category.id, formatCategoryMenuDto);
    }
  }
}
