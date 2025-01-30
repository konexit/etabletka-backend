import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { UserProfile } from './entities/user-prolile.entity';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@ApiTags('profile')
@Controller('/api/v1/user')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) { }

  @UseGuards(JwtAuthGuard)
  @Get('/profile/:userId')
  async getProfileByUserId(@Param('userId') userId: number): Promise<UserProfile> {
    return this.userProfileService.getProfileByUserId(+userId);
  }
}
