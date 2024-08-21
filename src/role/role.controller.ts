import { Controller, Get, Param, Req } from '@nestjs/common';
import { RoleService } from './role.service';
import { Request } from 'express';
import { Role } from './entities/role.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('roles')
@Controller('api/v1')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('/roles')
  async getRoles(@Req() request: Request): Promise<Role[]> {
    const token = request.headers.authorization?.split(' ')[1] ?? '';
    return await this.roleService.getRoles(token);
  }

  @Get('/role/:id')
  async getRoleById(@Param('id') id: number): Promise<Role> {
    return await this.roleService.getRoleById(+id);
  }
}
