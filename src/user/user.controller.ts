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
  Req,
} from '@nestjs/common';

import { AuthGuard } from '../auth/auth.guard';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('api/v1')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/user/create')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Patch('/user/update/:id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete('/user/delete/:id')
  async remove(@Param('id') id: number) {
    return await this.userService.remove(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/user/activation')
  async activation(@Body() data: any): Promise<User> {
    return await this.userService.activation(data.phone, data.code);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard)
  @Get('/users')
  async findAll(@Req() request: Request): Promise<User[]> {
    const token = request.headers.authorization?.split(' ')[1] ?? '';
    return await this.userService.findAll(token);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/users/role/:id')
  async getUserByRoleId(@Param('id') id: number): Promise<User[]> {
    return await this.userService.getUserByRoleId(+id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/user/:id')
  async getUserById(@Param('id') id: number): Promise<User> {
    return await this.userService.getUserById(+id);
  }
}
