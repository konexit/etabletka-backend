import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { LessThanOrEqual, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { CategoryNode } from './categories.module';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

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

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }

  async formatMenu(depth: number = 3) {
    const cacheCategoryMenu: ReturnType<typeof this.buildMenuTree> =
      await this.cacheManager.get(this.cacheMenuKey);

    if (cacheCategoryMenu) return cacheCategoryMenu;

    const categories = await this.categoryRepository.find({
      where: { active: true },
      order: {
        position: 'ASC',
      },
    });

    const categoryMenu = this.buildMenuTree(categories, depth);

    await this.cacheManager.set(
      this.cacheMenuKey,
      categoryMenu,
      this.cacheMenuTTL,
    );

    return categoryMenu;
  }

  async formatMenuRoot() {
    const resultMenu: Category[] = [];
    const rootCategories: Category[] = await this.findByRoot();

    for (let i = 0; i < rootCategories.length; i++) {
      resultMenu.push(rootCategories[i]);
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

  async findById(id: number, depth: number = 3) {
    const category = await this.categoryRepository.findOneBy({
      id,
      active: true,
    });

    const categories = await this.categoryRepository.find({
      where: {
        active: true,
        id: Not(category.id),
      },
    });

    return {
      ...category,
      children: this.getCategoryTree(category.id, categories, depth),
    };
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

  async findByPath(path: string): Promise<{
    formatCategory: Category;
    idMap: Map<number, Category>;
  }> {
    const idMap: Map<number, Category> = new Map();
    const category = await this.categoryRepository.findOneBy({
      path,
      active: true,
    });

    if (!category) {
      throw new HttpException('Category not found', HttpStatus.BAD_REQUEST);
    }

    const categories = await this.categoryRepository.find({
      where: {
        lft: MoreThanOrEqual(category.lft),
        rgt: LessThanOrEqual(category.rgt),
        active: true,
        id: Not(category.id),
      },
    });

    for (let i = 0; i < categories.length; i++) {
      idMap.set(categories[i].id, categories[i]);
    }

    return { formatCategory: category, idMap };
  }

  private getCategoryTree(
    categoryId: Category['id'],
    categories: CategoryNode[] | Category[],
    depthLimit: number,
    depth: number = 1,
  ): CategoryNode[] {
    if (depth > depthLimit) {
      return [];
    }

    const filteredCategories = categories.filter(
      (node) => node.parentId === categoryId,
    ) as CategoryNode[];

    return filteredCategories.map((node) => {
      const children = this.getCategoryTree(
        node.id,
        categories,
        depthLimit,
        depth + 1,
      );

      node.children = children.length > 0 ? children : [];

      return node;
    });
  }

  private buildMenuTree(
    categories: Category[],
    depth: number,
    fromCategory: Category = null,
  ) {
    const idMap: Map<number, CategoryNode & { depth: number }> = new Map();
    const rootNodes: CategoryNode[] = [];

    for (let i = 0; i < categories.length; i++) {
      idMap.set(
        categories[i].id,
        Object.assign({}, categories[i], {
          depth: 1,
          children: [],
        }),
      );
    }

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
}
