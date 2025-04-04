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
  ParseIntPipe,
  UploadedFile,
  HttpCode,
  HttpStatus
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
import { OptionalJwtAuthGuard } from 'src/auth/jwt/optional-jwt-auth.guard';
import { UserProfile } from './entities/user-profile.entity';
import { UserIdGuard } from 'src/common/guards/user-id.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @UseGuards(JwtAuthGuard, UserIdGuard)
  @Get('/user/profile/:userId')
  async getProfileByUserId(@Param('userId', ParseIntPipe) userId: number): Promise<UserProfile> {
    return this.userService.getProfileByUserId(userId);
  }

  @UseGuards(JwtAuthGuard, UserIdGuard)
  @Post('/user/profile/avatar/:userId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatarProfileByUserId(
    @Param('userId', ParseIntPipe) userId: number,
    @UploadedFile() file: Express.Multer.File
  ): Promise<General.URL> {
    return this.userService.uploadAvatar(userId, file);
  }

  @UseGuards(JwtAuthGuard, UserIdGuard)
  @Delete('/user/profile/avatar/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAvatarProfileByUserId(@Param('userId', ParseIntPipe) userId: number): Promise<void> {
    return this.userService.deleteAvatar(userId);
  }

  @UseGuards(JwtAuthGuard, UserIdGuard)
  @Patch('/user/profile/:userId')
  async patchProfileByUserId(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateProfileDto: UpdateProfileDto
  ): Promise<UserProfile> {
    return this.userService.patchProfileByUserId(userId, updateProfileDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard, UserIdGuard)
  @Get('/user/:userId')
  async getUserById(@Param('userId', ParseIntPipe) userId: number): Promise<User> {
    return this.userService.getUserById(userId);
  }
}
