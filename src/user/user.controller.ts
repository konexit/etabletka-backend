import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  HttpException,
  ParseIntPipe
} from '@nestjs/common';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JWTPayload } from 'src/common/decorators/jwt-payload';
import { JwtPayload } from 'src/common/types/jwt/jwt.interfaces';
import { HttpStatusCode } from 'axios';
import { OptionalJwtAuthGuard } from 'src/auth/jwt/optional-jwt-auth.guard';
import { UserProfile } from './entities/user-prolile.entity';

@ApiTags('users')
@Controller('api/v1')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/user/create')
  async create(@Body() createUserDTO: CreateUserDto): Promise<void> {
    return this.userService.create(createUserDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/user/update/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDTO: UpdateUserDto) {
    return this.userService.update(id, updateUserDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/user/delete/:id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.userService.remove(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Post('/user/password/change')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @JWTPayload() jwtPayload: JwtPayload
  ): Promise<void> {
    return this.userService.changePassword(jwtPayload.userId, changePasswordDto.password);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(OptionalJwtAuthGuard)
  @Get('/users')
  async findAll(
    @JWTPayload() jwtPayload: JwtPayload,
    @Query() pagination?: PaginationDto,
    @Query('where') where?: any,
  ): Promise<General.Page<User>> {
    return this.userService.findAll(jwtPayload, pagination, where);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get('/users/role/:id')
  async getUserByRoleId(@Param('id', ParseIntPipe) id: number): Promise<User[]> {
    return this.userService.getUserByRoleId(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user/profile/:userId')
  async getProfileByUserId(@Param('userId', ParseIntPipe) userId: number): Promise<UserProfile> {
    return this.userService.getProfileByUserId(userId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get('/user/:id')
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
    @JWTPayload() jwtPayload: JwtPayload
  ): Promise<User> {
    if (jwtPayload.userId != id) {
      throw new HttpException('User access denied', HttpStatusCode.Forbidden);
    }
    return this.userService.getUserById(id);
  }
}
