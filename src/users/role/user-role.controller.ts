import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RoleService } from './user-role.service';
import { Request } from 'express';
import { UserRole } from './entities/role.entity';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateRole } from './dto/create-user-role.dto';
import { UpdateRole } from './dto/update-user-role.dto';

@ApiTags('roles')
@Controller('api/v1')
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @UseGuards(AuthGuard)
  @Post('/role')
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Req() request: Request, @Body() createRole: CreateRole) {
    const token = request.headers.authorization?.split(' ')[1] ?? '';
    return this.roleService.create(token, createRole);
  }

  @UseGuards(AuthGuard)
  @Patch('/role/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Req() request: Request,
    @Param('id') id: number,
    @Body() updateRole: UpdateRole,
  ) {
    try {
      const token = request.headers.authorization?.split(' ')[1] ?? '';

      return await this.roleService.update(token, +id, updateRole);
    } catch (e) {
      throw e;
    }
  }

  @UseGuards(AuthGuard)
  @Delete('/delete/:id')
  async delete(@Req() request: Request, @Param('id') id: number) {
    const token = request.headers.authorization?.split(' ')[1] ?? '';
    try {
      return await this.roleService.delete(token, id);
    } catch (error) {
      throw error;
    }
  }

  @Get('/roles')
  async getRoles(@Req() request: Request): Promise<UserRole[]> {
    const token = request.headers.authorization?.split(' ')[1] ?? '';
    return await this.roleService.getRoles(token);
  }

  @Get('/role/:id')
  async getRoleById(@Param('id') id: number): Promise<UserRole> {
    return await this.roleService.getRoleById(+id);
  }
}
