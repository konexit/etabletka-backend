import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { SMSProvider } from '../providers/sms'
import { PaginationDto } from '../common/dto/paginationDto';
import { SALT } from 'src/auth/auth.constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
    private smsProvider: SMSProvider,
  ) {}

  async create(createUserDTO: CreateUserDTO): Promise<User> {
    const userExist = await this.userRepository.findOneBy({
      phone: createUserDTO.phone,
    });
    if (userExist) return userExist;

    const user = this.userRepository.create(createUserDTO);
    if (!user) {
      throw new HttpException(
        `Can't create user with this data: ${createUserDTO}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    user.password = crypto
      .pbkdf2Sync(user.password, this.configService.get<string>(SALT), 1000, 64, `sha512`)
      .toString(`hex`);

    user.code = this.generateRandomNumber(6);

    await this.smsProvider.sendSMS(
      [user.phone],
      `Activation code: ${user.code}`,
    );

    return this.userRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDTO): Promise<User> {
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

  async findAll(
    token: string | any[],
    pagination: PaginationDto = {},
    where: any = {},
  ) {
    if (!token || typeof token !== 'string') {
      throw new HttpException('No access', HttpStatus.FORBIDDEN);
    }

    const { take = 15, skip = 0 } = pagination;
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    const total = await queryBuilder.getCount();

    queryBuilder
      .select('user')
      .addSelect('role.id')
      .addSelect('role.role')
      .leftJoin('user.role', 'role')
      .orderBy('user.createdAt', 'DESC')
      .take(take)
      .skip(skip)
      .where('user.id is not null');

    const users = await queryBuilder.getMany();
    if (!users) {
      throw new HttpException('Users not found', HttpStatus.NOT_FOUND);
    }

    return {
      users,
      pagination: { total, take, skip },
    };
  }

  async getUserByRoleId(id: number): Promise<User[]> {
    const users = await this.userRepository.find({
      where: { role: { id } },
      relations: ['role'],
    });

    if (!users) {
      throw new HttpException('Users does not exist', HttpStatus.NOT_FOUND);
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
