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
  HttpException,
  ParseIntPipe
} from '@nestjs/common';

import { AuthGuard } from 'src/auth/auth.guard';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JWTPayload } from 'src/common/decorators/jwt-payload';
import { JwtPayload } from 'src/common/types/jwt/jwt.interfaces';
import { HttpStatusCode } from 'axios';

@ApiTags('users')
@Controller('api/v1')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/user/create')
  async create(@Body() createUserDTO: CreateUserDto): Promise<void> {
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

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/user/password/change')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @JWTPayload() jwtPayload: JwtPayload
  ): Promise<void> {
    return this.userService.changePassword(jwtPayload.userId, changePasswordDto.password);
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

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
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
