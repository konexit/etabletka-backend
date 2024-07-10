import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { SmsService } from '../services/sms.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
    private smsService: SmsService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userExist = await this.userRepository.findOneBy({
      phone: createUserDto.phone,
    });
    if (userExist) return userExist;

    const user = await this.userRepository.create(createUserDto);
    if (!user) {
      throw new HttpException(
        `Can't create user with this data: ${createUserDto}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const salt = this.configService.get('SALT');
    user.password = crypto
      .pbkdf2Sync(user.password, salt, 1000, 64, `sha512`)
      .toString(`hex`);

    user.code = this.generateRandomNumber(6);

    await this.smsService.sendSMS(
      [user.phone],
      `Activation code: ${user.code}`,
    );

    return this.userRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, updateUserDto);
    const user = await this.userRepository.findOneBy({ id: id });

    if (!user) {
      throw new HttpException(
        `Can't update user with data: ${updateUserDto}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  async getByPhone(phone: string): Promise<User> {
    if (!phone)
      throw new HttpException(
        'The phone is not define',
        HttpStatus.BAD_REQUEST,
      );

    const user = await this.userRepository.findOneBy({ phone: phone });
    if (user) {
      return user;
    }

    throw new HttpException(
      'User with this phone does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async activation(phone: string, code: string) {
    const user = await this.userRepository.findOneBy({ phone: phone });
    if (!user) {
      throw new HttpException(
        'User with this phone does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    if (user.isActive) {
      user.code = null;
      return await this.userRepository.save(user);
    }

    if (user.code !== code) {
      throw new HttpException(
        'User activation code miss match',
        HttpStatus.NOT_FOUND,
      );
    }

    user.code = null;
    user.isActive = true;

    return await this.userRepository.save(user);
  }

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

  async findAll(token: string | any[]): Promise<User[]> {
    if (!token || typeof token !== 'string') {
      throw new HttpException('No access', HttpStatus.FORBIDDEN);
    }

    const users = await this.userRepository.find();

    if (!users) {
      throw new HttpException('Users not found', HttpStatus.NOT_FOUND);
    }

    return users;
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role'],
    });

    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async remove(id: number) {
    return this.userRepository.delete(id);
  }

  generateRandomNumber(symbols: number) {
    const randomNumber = Math.floor(Math.random() * 1000000);

    return randomNumber.toString().padStart(symbols, '0');
  }
}
