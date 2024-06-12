import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SmsService } from '../services/sms.service';
import { UserProfile } from '../userProfile/entities/userProlile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserProfile])],
  controllers: [UserController],
  providers: [UserService, SmsService],
  exports: [UserService, UserModule],
})
export class UserModule {}
