import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async getRoles(token: string | any[]): Promise<Role[]> {
    if (!token || typeof token !== 'string') {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const roles = await this.roleRepository.find({});

    if (!roles) {
      throw new HttpException('Roles not found', HttpStatus.NOT_FOUND);
    }

    return roles;
  }

  async getRoleById(id: number): Promise<Role> {
    const role = await this.roleRepository.findOneBy({ id });

    if (!role) {
      throw new HttpException('Roles not found', HttpStatus.NOT_FOUND);
    }

    return role;
  }
}
