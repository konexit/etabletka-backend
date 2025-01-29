import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from './entities/role.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateRole } from './dto/create-user-role.dto';
import { UpdateRole } from './dto/update-user-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(UserRole)
    private roleRepository: Repository<UserRole>,
    private jwtService: JwtService,
  ) { }

  async create(token: string, createRole: CreateRole) {
    if (!token || typeof token !== 'string') {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const payload = await this.jwtService.decode(token);
    if (payload?.roleId !== 1) {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const role = this.roleRepository.create(createRole);
    if (!role) {
      throw new HttpException(
        `Can't create role with data: ${createRole}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.roleRepository.save(role);
  }

  async update(token: string, id: number, updateRole: UpdateRole) {
    if (!token || typeof token !== 'string') {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const payload = await this.jwtService.decode(token);
    if (payload?.roleId !== 1) {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    await this.roleRepository.update(id, updateRole);

    const role = await this.roleRepository.findOneBy({ id });
    if (!role) {
      throw new HttpException(
        `Can't update role with data: ${updateRole}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return role;
  }

  async delete(token: string, id: number) {
    if (!token || typeof token !== 'string') {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const payload = await this.jwtService.decode(token);
    if (payload?.roleId !== 1) {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    const role = this.roleRepository.findOneBy({ id });
    if (!role) {
      throw new HttpException('Can`t delete role', HttpStatus.NOT_FOUND);
    }

    return this.roleRepository.delete(id);
  }

  async getRoles(token: string | any[]): Promise<UserRole[]> {
    if (!token || typeof token !== 'string') {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const roles = await this.roleRepository.find({});

    if (!roles) {
      throw new HttpException('Roles not found', HttpStatus.NOT_FOUND);
    }

    return roles;
  }

  async getRoleById(id: number): Promise<UserRole> {
    const role = await this.roleRepository.findOneBy({ id });

    if (!role) {
      throw new HttpException('Roles not found', HttpStatus.NOT_FOUND);
    }

    return role;
  }
}
