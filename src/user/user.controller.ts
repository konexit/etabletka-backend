import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';

import { AuthGuard } from '../auth/auth.guard';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Controller('api/v1')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/user/create')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard)
  @Get('/users')
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/user/:id')
  async getUserById(@Param('id') id: number): Promise<User> {
    return await this.userService.getUserById(+id);
  }

  @UseGuards(AuthGuard)
  @Patch('/user/update/:id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete('/user/delete/:id')
  remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}
