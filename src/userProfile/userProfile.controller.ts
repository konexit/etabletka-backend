import { Controller, Get, Param } from '@nestjs/common';
import { UserProfileService } from './userProfile.service';
import { UserProfile } from './entities/userProlile.entity';

@Controller('/api/v1')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Get('/profile/:userId')
  async getProfileByUserId(
    @Param('userId') userId: number,
  ): Promise<UserProfile> {
    return await this.userProfileService.getProfileByUserId(+userId);
  }
}
