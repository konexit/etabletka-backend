import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProfile } from './entities/user-prolile.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getProfileByUserId(
    userId: number,
  ): Promise<Promise<UserProfile> | Promise<any>> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (user.isActive) {
      const userProfile = await this.userProfileRepository.findOneBy({
        userId,
      });

      if (!userProfile) {
        throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
      }

      return userProfile;
    }

    return {};
  }
}
