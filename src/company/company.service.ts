import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly storeBrandRepository: Repository<Company>
  ) { }

  async getAllStoreBrands(): Promise<Company[]> {
    const storeBrands = await this.storeBrandRepository.find({});
    if (!storeBrands) {
      throw new HttpException('Store brands not found', HttpStatus.NOT_FOUND);
    }
    return storeBrands;
  }

  async getStoreBrandById(id: number): Promise<Company> {
    const storeBrand = await this.storeBrandRepository.findOneBy({ id });
    if (!storeBrand) {
      throw new HttpException('Store brand not found', HttpStatus.NOT_FOUND);
    }
    return storeBrand;
  }
}
