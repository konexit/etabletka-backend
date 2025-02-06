import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { SMSProvider } from 'src/providers/sms'
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { SALT } from 'src/auth/auth.constants';
import { USER_PASSWORD_ACTIVATION_CODE_SIZE } from 'src/common/config/common.constants';
import { generateRandomNumber } from 'src/common/utils';
import { getPasswordWithSHA512 } from 'src/common/utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
    private smsProvider: SMSProvider
  ) { }

  async create(createUserDto: CreateUserDto): Promise<void> {
    const userExist = await this.userRepository.findOneBy({ login: createUserDto.login });
    if (userExist) {
      throw new HttpException(
        `User login: ${createUserDto.login}`,
        HttpStatus.CONFLICT
      );
    }

    const user = this.userRepository.create(createUserDto);
    if (!user) {
      throw new HttpException(
        `Can't create user with this data: ${createUserDto}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    user.password = getPasswordWithSHA512(createUserDto.password, this.configService.get<string>(SALT));
    user.code = generateRandomNumber(USER_PASSWORD_ACTIVATION_CODE_SIZE);

    await this.smsProvider.sendSMS(
      [user.phone],
      `Activation code: ${user.code}`,
    );

    await this.userRepository.save(user);

    return;
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

  async getUserForJwtByLogin(login: string, isActive: boolean = true): Promise<User> {
    return this.userRepository.findOne({
      select: {
        id: true,
        password: true,
        code: true,
        role: {
          role: true
        }
      },
      where: {
        login,
        isActive
      },
      relations: ['role'],
    });
  }

  async getByLoginForActivation(login: string): Promise<User> {
    return this.userRepository.findOne({
      select: {
        id: true,
        login: true,
        code: true,
        updatedAt: true
      },
      where: {
        login
      }
    });
  }

  async changePassword(userId: number, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new HttpException(
        'User not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    if (!user.isActive) {
      throw new HttpException(
        'User is not activated',
        HttpStatus.CONFLICT,
      );
    }

    user.code = null;
    user.password = getPasswordWithSHA512(newPassword, this.configService.get<string>(SALT));

    await this.userRepository.save(user);

    return;
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

  async save(user: User) {
    return this.userRepository.save(user);
  }
}
