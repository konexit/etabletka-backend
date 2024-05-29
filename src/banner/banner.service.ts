import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Banner } from './entities/banner.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(Banner)
    private bannerRepository: Repository<Banner>,
    private jwtService: JwtService,
  ) {}

  async getPublishedBanners(): Promise<Banner[] | undefined> {
    return await this.bannerRepository.find({
      where: { isPublished: true },
    });
  }

  async findBannerBySlug(slug: string): Promise<Banner> | undefined {
    return this.bannerRepository.findOneBy({ slug });
  }
}
