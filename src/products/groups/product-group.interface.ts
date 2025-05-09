import { Breadcrumbs } from "src/common/types/common/general.interface";
import { ProductGroup } from "./entities/product-group.entity";

export interface ProductGroupPage {
  breadcrumbs: Breadcrumbs;
  content: {
    id: ProductGroup['id']
    name: ProductGroup['name']['uk'];
    slug: ProductGroup['slug'];
  }
}