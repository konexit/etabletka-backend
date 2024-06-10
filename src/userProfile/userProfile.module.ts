import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfile } from './entities/userProlile.entity';
import { UserProfileController } from './userProfile.controller';
import { UserProfileService } from './userProfile.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserProfile])],
  controllers: [UserProfileController],
  providers: [UserProfileService],
  exports: [UserProfileService, UserProfileModule],
})
export class UserProfileModule {}
