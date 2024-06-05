import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Res,
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
  async create(@Body() createUserDto: CreateUserDto, @Res() res: any) {
    try {
      const user = await this.userService.create(createUserDto);
      if (!user) {
        return res.status(404).json({ message: 'Can not create new user' });
      }

      return res.json(user);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Internal server error', error: error });
    }
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/users')
  async findAll(@Res() res: any): Promise<User[]> {
    try {
      const users = await this.userService.findAll();
      if (!users) {
        return res.status(404).json({ message: 'Can not get users' });
      }

      return res.json(users);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Internal server error', error: error });
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/user/:id')
  async getUserById(@Param('id') id: number, @Res() res: any): Promise<User> {
    try {
      const user = await this.userService.getUserById(+id);
      if (!user) {
        return res.status(404).json({ message: 'Can not create new user' });
      }

      return res.json(user);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Internal server error', error: error });
    }
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
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
