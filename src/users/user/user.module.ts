import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SMSProvider } from 'src/providers/sms';
import { UserProfile } from '../profile/entities/user-prolile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserProfile])],
  controllers: [UserController],
  providers: [UserService, SMSProvider],
  exports: [UserService],
})
export class UserModule { }
