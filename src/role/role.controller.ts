import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { RoleService } from './role.service';
import { Request } from 'express';
import { Role } from './entities/role.entity';

@Controller('api/v1')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('/roles')
  async getRoles(@Req() request: Request, @Res() res: any): Promise<Role[]> {
    const token = request.headers.authorization?.split(' ')[1] ?? [];
    try {
      const roles = await this.roleService.getRoles(token);
      if (!roles) {
        return res.status(404).json({ message: 'Can not get roles' });
      }

      return res.json(roles);
    } catch (error) {
      return res.status(error.status).json(error);
    }
  }

  @Get('/role/:id')
  async getRoleById(@Param('id') id: number, @Res() res: any): Promise<Role> {
    try {
      const role = await this.roleService.getRoleById(+id);

      if (!role) {
        return res.status(404).json({ message: 'Can not get role' });
      }

      return res.json(role);
    } catch (error) {
      return res.status(error.status).json(error);
    }
  }
}
