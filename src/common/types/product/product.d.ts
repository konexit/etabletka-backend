declare namespace Products {
  export type AttributeType = 'attributes' | 'main' | 'preview';

  export type AttributeKey = 'size' | 'alcohol' | 'package' | 'quantity' | 'manufacturer' | 'primary-packaging' | 'production-form' |
    'brand-series-line' | 'country-of-origin' | 'prescription' | 'active-substance' | 'dosage' | 'pregnant' | 'quantity-primary-packaging' |
    'storage-temperature' | 'brand' | 'brand-name';

  export type Product = {
    id: number;
    syncId: number;
    categories: Categories.Category[];
    productTypeId: number;
    atc: number | string;
    name: string;
    shortName: string;
    morionCode: number;
    price: number;
    rating: number;
    reviewsCount: number;
    discounts?: Discount[];
    inStoke: boolean;
    isActive: boolean;
    isHidden: boolean;
    isPrescription: boolean;
    instructionEn: string | null;
    instructionRu: string | null;
    instructionUk: string | null;
    slug: string;
    seoH1: string | null;
    seoH1Auto: boolean;
    seoTitle: string | null;
    seoTitleAuto: boolean;
    seoDescription: string | null;
    seoDescriptionAuto: boolean;
    seoKeywords: string | null;
    seoKeywordsAuto: boolean;
    cdnInstruction: General.I18NObject<Instruction>;
    cdnData: General.CDNData | null;
    productRemnants: Remnants[];
    reviews: Review[];
    attributes: Attributes;
  } & General.Timestamps;

  export type Attributes = {
    [key in AttributeType]: Attribute[];
  } & {
    price: {
      denominator: number;
      wholeName: string;
      partName: string;
    }
  }

  export type AttributeValueRaw = {
    id: number | null;
    color: string | null;
    icon: string | null;
    path: string | null;
    name: {
      uk: string;
    };
    slug: string;
  }

  export type AttributesRaw = {
    [key in AttributeKey]: AttributeValueRaw | AttributeValueRaw[]
  }

  export type Attribute = {
    name: string;
    order: number;
    value: AttributeValue | AttributeValue[];
  }

  export type AttributeValue = {
    id: number | null;
    color: string | null;
    icon: string | null;
    path: string | null;
    name: string;
    slug: string;
  }

  export type Discount = {
    id: number;
    name: string;
    slug: string;
    cdnData: General.CDNData | null;
    type: number;
    value: number;
    discountPrice: number;
    publishStart: Date;
    publishEnd: Date;
  } & General.Timestamps;

  export type Remnants = {
    id: number;
    isActive: boolean;
    productId: number;
    quantity: number;
    storeId: number;
    store: Pharmacies.Pharmacy;
  } & General.Timestamps;

  export type Instruction = {
    filename: string;
    url: string;
  }

  export type Review = {
    id: number;
    name: string;
    text: string;
    rating: number;
    likes: number;
    dislikes: number;
    children: Omit<Review, 'rating' | 'likes' | 'dislikes' | 'children'>[];
  } & General.Timestamps;

  export type SearchQueryResponse = {
    hits: (Omit<SearchResult, 'cdnData'> & { cdn_data?: SearchResult['cdnData'] })[];
    query: string;
    estimatedTotalHits: number;
  }

  export type SearchResult = Pick<Product, 'id' | 'name' | 'price' | 'slug' | 'cdnData'>

  export type FacetSearchResult = {
    filters: Filter[];
    products: Pick<Product, 'id' | 'name' | 'price' | 'slug' | 'rating'>[];
    limit: number;
    offset: number;
    estimatedTotalHits: number;
    query: string;
  }

  export type RangeFilter = {
    name: string;
    order: number;
    alias: string;
    typeUI: 'range';
    values: FilterValue;
  }

  export type CheckboxFilter = {
    name: string;
    order: number;
    alias: string;
    typeUI: 'checkbox';
    values: FilterValue[];
  }

  export type FilterValue = {
    name: string;
    alias: string;
    count?: number;
    min?: number | null;
    max?: number | null;
  };

  export type Filter = RangeFilter | CheckboxFilter;
}
