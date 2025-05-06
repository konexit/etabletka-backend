import { Breadcrumbs } from "src/common/types/common/general.interface";
import { Category } from "./entities/category.entity";

interface BaseNode {
	id: number;
	name: string;
	slug: string;
	children: BaseNode[];
}

interface RootNode extends BaseNode {
	icon: string;
	image: string;
}

export type CategoryNavNode<IsRoot extends boolean> = IsRoot extends true ? RootNode : BaseNode;

export interface RootCategoryNav {
	root: true;
	breadcrumbs: Breadcrumbs;
	children: RootNode[];
}

export interface NonRootCategoryNav {
	root: false;
	breadcrumbs: Breadcrumbs;
	children: BaseNode[];
}

export interface CategoryMenuRoot {
	id: Category['id'];
	name: Category['name'];
	icon: string;
	slug: string;
}

export interface CategoryMenu {
	id: Category['id'];
	name: Category['name'];
	slug: string;
	image: string;
	children: CategoryMenu[];
}

export type CategoryNav = RootCategoryNav | NonRootCategoryNav;

export type Categories = Category[] | CategoryMenuRoot[] | CategoryMenu[];

export type DefaultDepth = {
	nav: number;
	navRoot: number;
};

export type CategoryFilter = Category | Category[];

