import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { SMSProvider } from 'src/providers/sms'
import { PaginationDto } from 'src/common/dto/paginationDto';
import { ChangePasswordDto, PasswordRecoveryDto } from './dto/change-password.dto';
import { SALT } from 'src/auth/auth.constants';
import { UniqueLoginDto } from './dto/unique-login.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
    private smsProvider: SMSProvider,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userExist = await this.userRepository.findOneBy({ login: createUserDto.login });
    if (userExist) {
      return Promise.resolve<User>(userExist);
    }

    const user = this.userRepository.create(createUserDto);
    if (!user) {
      throw new HttpException(
        `Can't create user with this data: ${createUserDto}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    user.password = this.getPasswordWithSHA512(createUserDto.password);
    user.code = this.generateRandomNumber(6);

    await this.smsProvider.sendSMS(
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

  async getByLogin(login: string): Promise<User> {
    if (!login)
      throw new HttpException(
        'The login is not define',
        HttpStatus.BAD_REQUEST,
      );

    const user = await this.userRepository.findOne({
      select: {
        id: true,
        password: true,
        role: {
          role: true
        }
      },
      where: { login },
      relations: ['role'],
    });
    if (user) {
      return user;
    }

    throw new HttpException(
      'User with this login does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async activation(login: string, code: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ login });
    if (!user) {
      throw new HttpException(
        'User with this login does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    if (user.isActive) {
      return Promise.resolve<User>(user);
    }

    if (user.code !== code) {
      throw new HttpException(
        'User activation code miss match',
        HttpStatus.NOT_FOUND,
      );
    }

    user.code = null;
    user.isActive = true;

    return this.userRepository.save(user);
  }

  async passwordRecovery(passwordRecoveryDto: PasswordRecoveryDto): Promise<void> {
    const user = await this.userRepository.findOne({
      select: {
        id: true,
        login: true,
        code: true
      },
      where: {
        login: passwordRecoveryDto.login
      }
    });

    if (!user) {
      throw new HttpException(
        'User with this login does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    user.code = this.generateRandomNumber(6);

    await this.smsProvider.sendSMS(
      [passwordRecoveryDto.phone],
      `Recovery code: ${user.code}`,
    );

    await this.userRepository.save(user);

    return;
  }

  async changePassword(changePasswordDto: ChangePasswordDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ login: changePasswordDto.login });
    if (!user) {
      throw new HttpException(
        'User with this login does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    if (!user.isActive) {
      throw new HttpException(
        'User is not activated',
        HttpStatus.CONFLICT,
      );
    }

    if (user.code !== changePasswordDto.code) {
      throw new HttpException(
        {
          message: 'User recovery code mismatch',
          expected: user.code,
          received: changePasswordDto.code,
        },
        HttpStatus.NOT_MODIFIED,
      );
    }

    user.code = null;
    user.password = this.getPasswordWithSHA512(changePasswordDto.password);

    return this.userRepository.save(user);
  }

  async checkUniqueLogin(login: string): Promise<void> {
    const exists = await this.userRepository.exists({ where: { login } });
    if (exists) {
      throw new HttpException(
        'User with this login exist',
        HttpStatus.CONFLICT,
      );
    }

    return;
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

  private generateRandomNumber(symbols: number) {
    const randomNumber = Math.floor(Math.random() * 1000000);
    return randomNumber.toString().padStart(symbols, '0');
  }

  private getPasswordWithSHA512(purePassword: string): string {
    return crypto.pbkdf2Sync(purePassword, this.configService.get<string>(SALT), 1000, 64, `sha512`).toString(`hex`);
  }
}
