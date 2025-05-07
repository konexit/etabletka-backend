import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { In, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { CacheKeys } from 'src/settings/refresh/refresh-keys';
import { FilterCategoryDto } from './dto/filter-category.dto';
import {
  Categories,
  CategoryFilter,
  CategoryMenu,
  CategoryMenuRoot,
  CategoryNav,
  CategoryNavNode,
  DefaultDepth
} from './categories.interface';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);
  private cacheMenuTTL = 60_000;
  private defaultDepth: DefaultDepth = {
    nav: 1,
    navRoot: 3
  };

  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) { }

  createCategory(createCategoryDto: CreateCategoryDto) {
    return 'This action adds a new category';
  }

  patchCategory(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  removeCategory(id: number) {
    return `This action removes a #${id} category`;
  }

  async findAll(format: string, lang = 'uk'): Promise<Categories> {
    switch (format) {
      case 'menu':
        return this.formatMenu(this.defaultDepth.navRoot, lang);
      case 'menu-root':
        return this.formatMenuRoot(lang);
      default:
        return this.categoryRepository.find();
    }
  }

  async getNavCategory(id: number, depth: number, lang = 'uk'): Promise<CategoryNav> {
    const category = await this.categoryRepository.findOne({
      select: ['id', 'name', 'slug', 'root', 'path', 'lft', 'rgt'],
      where: { id, active: true },
    });

    if (!category) {
      throw new NotFoundException();
    }


    const categoryBreadcrumbs = await this.categoryRepository.find({
      select: ['id', 'name', 'slug'],
      where: { id: In(category.path), active: true },
      order: { lft: 'ASC' },
    });

    const categoryChildren = await this.categoryRepository.find({
      select: ['id', 'name', 'slug', 'parentId', ...(category.root ? ['icon', 'image'] as (keyof Category)[] : [])],
      where: {
        active: true,
        lft: MoreThanOrEqual(category.lft),
        rgt: LessThanOrEqual(category.rgt),
      },
    });

    const defaultDepth = category.root ? this.defaultDepth.navRoot : this.defaultDepth.nav;

    const children = this.getCategoryTree<typeof category.root>(category.root, category.id, categoryChildren, depth ?? defaultDepth);

    const breadcrumbs = categoryBreadcrumbs.map(b => ({
      name: b.name[lang],
      index: true,
      path: `/category/${b.slug}-${b.id}`,
    }));

    return {
      root: category.root,
      breadcrumbs,
      children,
    } as CategoryNav;
  }

  async findByFilter(filterCategoryDto: FilterCategoryDto): Promise<CategoryFilter> {
    if (filterCategoryDto.root) {
      return this.findByRoot();
    } else if (filterCategoryDto.parent_id) {
      return this.findByParentId(filterCategoryDto.parent_id);
    } else if (filterCategoryDto.slug) {
      return this.findBySlug(filterCategoryDto.slug);
    }

    throw new NotFoundException('Filter not supported');
  }

  async cacheReset() {
    this.cacheManager.set(CacheKeys.Categories, null);
  }

  async getCategoryChildrenId(id: Category['id']): Promise<Category['id'][]> {
    const { lft, rgt } = await this.categoryRepository.findOneOrFail({
      where: { id: 553 },
      select: ['lft', 'rgt'],
    });

    const children = await this.categoryRepository.find({
      where: {
        lft: MoreThanOrEqual(lft),
        rgt: LessThanOrEqual(rgt),
      },
      select: ['id'],
    });

    return children.map(c => c.id);
  }

  private async findByRoot(): Promise<Category[]> {
    return this.categoryRepository.find({
      select: ['id', 'name', 'icon', 'slug'],
      where: {
        root: true,
        active: true
      },
      order: {
        position: 'ASC',
      },
    });
  }

  private async findByParentId(id: number): Promise<Category[]> {
    const { lft, rgt } = await this.categoryRepository.findOne({
      where: { id },
      select: ['lft', 'rgt'],
    });

    return this.categoryRepository.find({
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

  private async findBySlug(slug: string): Promise<Category> {
    return this.categoryRepository.findOneBy({ slug, active: true });
  }

  private getCategoryTree<IsRoot extends boolean>(
    isRoot: IsRoot,
    rootId: Category['id'],
    rows: Category[],
    depthLimit: number,
    lang = 'uk'
  ): CategoryNavNode<IsRoot>[] {
    const map = new Map<number, CategoryNavNode<IsRoot>>();
    const parentMap = new Map<number | null, number[]>();

    for (const row of rows) {
      const node = {
        id: row.id,
        name: row.name?.[lang] || '',
        slug: row.slug,
        ...(isRoot && {
          icon: row.icon || '',
          image: row.image || '',
        }),
        children: [],
      } as CategoryNavNode<IsRoot>;

      map.set(row.id, node);

      const parentId = row.parentId ?? null;
      if (!parentMap.has(parentId)) {
        parentMap.set(parentId, []);
      }
      parentMap.get(parentId)!.push(row.id);
    }

    function buildTree(parentId: Category['id'], currentDepth: number): CategoryNavNode<IsRoot>[] {
      if (currentDepth > depthLimit) {
        return [];
      }

      const childIds = parentMap.get(parentId) || [];
      return childIds.map((id) => {
        const node = map.get(id)!;
        node.children = buildTree(id, currentDepth + 1);
        return node;
      });
    }

    return buildTree(rootId, 1);
  }

  private async formatMenuRoot(lang: string): Promise<CategoryMenuRoot[]> {
    const categories = await this.categoryRepository.find({
      select: ['id', 'name', 'icon', 'slug'],
      where: {
        root: true,
        active: true
      },
      order: {
        position: 'ASC',
      },
    });

    return categories.map((c) => ({
      id: c.id,
      name: c.name[lang],
      icon: c.icon,
      slug: c.slug,
    }));
  }

  private async formatMenu(depthLimit: number, lang: string): Promise<CategoryMenu[]> {
    const map = new Map<number, CategoryMenu>();
    const parentMap = new Map<number, number[]>();
    const rootIds: number[] = [];

    const categories = await this.categoryRepository.find({
      select: ['id', 'parentId', 'root', 'name', 'icon', 'slug', 'image'],
      where: {
        active: true,
      },
      order: {
        position: 'ASC',
      },
    });

    for (const row of categories) {
      const node: CategoryMenu = {
        id: row.id,
        name: row.name?.[lang] || '',
        slug: row.slug,
        image: row.image || '',
        children: [],
      };

      map.set(row.id, node);

      if (row.root) {
        rootIds.push(row.id);
      }

      const parentId = row.parentId;
      if (parentId !== null && parentId !== undefined) {
        if (!parentMap.has(parentId)) {
          parentMap.set(parentId, []);
        }
        parentMap.get(parentId)!.push(row.id);
      }
    }

    function buildTree(parentId: Category['id'], currentDepth: number): CategoryMenu {
      const node = map.get(parentId)!;
      if (currentDepth >= depthLimit) {
        return node;
      }

      const childIds = parentMap.get(parentId) || [];
      node.children = childIds.map((childId) => buildTree(childId, currentDepth + 1));
      return node;
    }

    return rootIds.map((rootId) => buildTree(rootId, 1));;
  }
}
