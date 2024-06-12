import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfile } from './entities/userProlile.entity';
import { UserProfileController } from './userProfile.controller';
import { UserProfileService } from './userProfile.service';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserProfile, User])],
  controllers: [UserProfileController],
  providers: [UserProfileService],
  exports: [UserProfileService, UserProfileModule],
})
export class UserProfileModule {}
