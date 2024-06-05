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

    return await this.roleRepository.find({});
  }

  async getRoleById(id: number): Promise<Role> {
    return await this.roleRepository.findOneBy({ id });
  }
}
