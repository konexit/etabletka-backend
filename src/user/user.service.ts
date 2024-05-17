import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async getByEmail(email: string): Promise<User> {
    if (!email)
      throw new HttpException(
        'The email is not define',
        HttpStatus.BAD_REQUEST,
      );

    const user = await this.userRepository.findOneBy({ email: email });
    if (user) {
      return user;
    }

    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    const salt = this.configService.get('SALT');
    user.password = crypto
      .pbkdf2Sync(user.password, salt, 1000, 64, `sha512`)
      .toString(`hex`);
    await this.userRepository.save(user);
    console.log('USER:', user);
    return user;
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id: id });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, updateUserDto);
    const user = await this.userRepository.findOneBy({ id: id });
    if (user) {
      return user;
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  remove(id: number) {
    return `This action removes the #${id} user`;
  }
}
