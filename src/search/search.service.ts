import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Index, MeiliSearch, SearchParams } from "meilisearch";
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../product/entities/product.entity';
import { Repository } from 'typeorm';

// Documentation:  https://www.npmjs.com/package/meilisearch
@Injectable()
export class SearchService {
  private client: MeiliSearch;

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {
    this.client = new MeiliSearch({
      host: 'etab-meilisearch:7700',
      apiKey: '1AovuXGwTo93HgerTuo7wr2',
    });
  }

  private async getIndex(indexUid: string): Promise<Index> {
    const index = this.client.index(indexUid);

    await index.update({ primaryKey: 'id' });
    return index;
  }

  private async addDocumentsToIndex(documents: Array<any>): Promise<any> {
    const index = await this.getIndex('products');
    try {
      return await index.addDocuments(documents);
    } catch (error) {
      console.error('Error adding documents:', error);
      throw error;
    }
  }

  async makeIndex(lang: string = 'uk') {
    const products = await this.productRepository.find({
      relations: ['categories', 'brand'],
    });

    if (!products) {
      throw new HttpException(
        'Product with this syncId does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const documents = products.map((product) => ({
      id: product.id,
      syncId: product.syncId,
      isActive: product.isActive,
      isPrescription: product.isPrescription,
      name: product.name[lang],
      shortMame: product.shortName[lang],
      brandName: product.brand.name[lang],
      attributes: product.attributes,
    }));

    console.log('documents', documents);

    return await this.addDocumentsToIndex(documents);
  }

  async search(text: string, searchParams?: SearchParams) {
    const index = await this.getIndex('products');
    return await index.search(text, searchParams);
  }
}
