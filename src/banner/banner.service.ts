import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    const banners = await this.bannerRepository.find({
      where: { isPublished: true },
    });

    if (!banners) {
      throw new HttpException('Banners not found', HttpStatus.NOT_FOUND);
    }

    return banners;
  }

  async findBannerBySlug(slug: string): Promise<Banner> | undefined {
    const banner = await this.bannerRepository.findOneBy({ slug });

    if (!banner) {
      throw new HttpException('Banner not found', HttpStatus.NOT_FOUND);
    }

    return banner;
  }
}
