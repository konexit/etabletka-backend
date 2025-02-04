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
  Query,
} from '@nestjs/common';

import { AuthGuard } from 'src/auth/auth.guard';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ActivationDto } from './dto/activation.dto';
import { ChangePasswordDto, PasswordRecoveryDto } from './dto/change-password.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { UniqueLoginDto } from './dto/unique-login.dto';

@ApiTags('users')
@Controller('api/v1')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/user/create')
  async create(@Body() createUserDTO: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDTO);
  }

  @UseGuards(AuthGuard)
  @Patch('/user/update/:id')
  update(@Param('id') id: number, @Body() updateUserDTO: UpdateUserDto) {
    return this.userService.update(id, updateUserDTO);
  }

  @UseGuards(AuthGuard)
  @Delete('/user/delete/:id')
  async remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/user/activation')
  async activation(@Body() activationDto: ActivationDto): Promise<User> {
    return this.userService.activation(activationDto.login, activationDto.code);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/user/password/change')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto): Promise<User> {
    return this.userService.changePassword(changePasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/user/password/recovery')
  async changePasswordRecovery(@Body() passwordRecoveryDto: PasswordRecoveryDto): Promise<void> {
    return this.userService.passwordRecovery(passwordRecoveryDto);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/user/unique/login')
  async checkUniqueLogin(@Body() uniqueLoginDto: UniqueLoginDto): Promise<void> {
    return this.userService.checkUniqueLogin(uniqueLoginDto.login);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard)
  @Get('/users')
  async findAll(
    @Req() request: Request,
    @Query() pagination?: PaginationDto,
    @Query('where') where?: any,
  ) {
    const token = request.headers.authorization?.split(' ')[1] ?? '';
    return this.userService.findAll(token, pagination, where);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/users/role/:id')
  async getUserByRoleId(@Param('id') id: number): Promise<User[]> {
    return this.userService.getUserByRoleId(+id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/user/:id')
  async getUserById(@Param('id') id: number): Promise<User> {
    return this.userService.getUserById(+id);
  }
}
