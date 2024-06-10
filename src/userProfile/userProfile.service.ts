import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProfile } from './entities/userProlile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
  ) {}

  async getProfileByUserId(userId: number): Promise<UserProfile> {
    const userProfile = await this.userProfileRepository.findOneBy({ userId });

    if (!userProfile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    return userProfile;
  }
}
