import * as path from 'node:path';
import {
  HttpException,
  HttpStatus,
  Injectable,
  Inject,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserProfile } from './entities/user-profile.entity';
import { FindManyOptions, FindOptionsWhere, In, Repository } from 'typeorm';
import { SMSProvider } from 'src/providers/sms';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import {
  IMG_EXT_JPEG,
  USER_PASSWORD_ACTIVATION_CODE_SIZE,
} from 'src/common/config/common.constants';
import { generateRandomNumber } from 'src/common/utils';
import { hashPassword } from 'src/common/utils';
import { JwtPayload } from 'src/common/types/jwt/jwt.interfaces';
import { USER_ROLE_JWT_ADMIN } from './user.constants';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CDNProvider, CDN_PROVIDER_MANAGER } from 'src/providers/cdn';
import { CDNUploadOptions } from 'src/providers/cdn/cdn.options';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  private cdnAvatarPath = 'user/avatars';

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
    private smsProvider: SMSProvider,
    @Inject(CDN_PROVIDER_MANAGER)
    private cdnProvider: CDNProvider,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<void> {
    const userExist = await this.userRepository.findOneBy({
      login: createUserDto.login,
    });
    if (userExist) {
      throw new HttpException(
        `User login: ${createUserDto.login}`,
        HttpStatus.CONFLICT,
      );
    }

    const user = this.userRepository.create(createUserDto);
    if (!user) {
      throw new HttpException(
        `Can't create user with this data: ${createUserDto}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    user.password = await hashPassword(createUserDto.password);
    user.code = generateRandomNumber(USER_PASSWORD_ACTIVATION_CODE_SIZE);

    const { id: userId } = await this.userRepository.save(user);

    user.profile = this.userProfileRepository.merge(
      user.profile,
      createUserDto.profile,
      { userId },
    );

    await this.smsProvider.sendSMS(
      [createUserDto.login],
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

  async getUserForJwtByLogin(login: string, isActive = true): Promise<User> {
    return this.userRepository.findOne({
      select: {
        id: true,
        password: true,
        code: true,
        role: {
          role: true,
        },
      },
      where: isActive ? { login, isActive } : { login },
      relations: ['role'],
    });
  }

  async getByLoginForActivation(login: string): Promise<User> {
    return this.userRepository.findOne({
      select: {
        id: true,
        login: true,
        code: true,
        updatedAt: true,
      },
      where: { login },
    });
  }

  async changePassword(userId: number, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new HttpException('User not exist', HttpStatus.NOT_FOUND);
    }

    if (!user.isActive) {
      throw new HttpException('User is not activated', HttpStatus.CONFLICT);
    }

    user.code = null;
    user.password = await hashPassword(newPassword);

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

  async findAll(
    jwtPayload: JwtPayload,
    pagination: PaginationDto = {},
  ): Promise<General.Page<User>> {
    if (
      !jwtPayload ||
      !jwtPayload.roles ||
      !jwtPayload.roles.includes(USER_ROLE_JWT_ADMIN)
    ) {
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
      items: users,
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
      relations: ['role', 'profile'],
    });

    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async getProfileByUserId(userId: number): Promise<UserProfile> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        isActive: true,
      },
      relations: ['profile'],
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user.profile;
  }

  async getProfilesByUserIds(
    userIds: User['id'][],
    payload?: JwtPayload,
  ): Promise<
    (
      | Pick<UserProfile, 'id' | 'userId' | 'firstName' | 'avatar'>
      | UserProfile
    )[]
  > {
    const queryOptions: FindManyOptions<UserProfile> = {
      where: {
        userId: In(userIds),
      },
    };

    if (!payload?.roles.includes(USER_ROLE_JWT_ADMIN)) {
      queryOptions.select = ['id', 'userId', 'firstName', 'avatar'];
    }

    const profiles = await this.userProfileRepository.find(queryOptions);

    if (!profiles.length) {
      throw new HttpException('Profiles not found', HttpStatus.NOT_FOUND);
    }

    return profiles;
  }

  async patchProfileByUserId(
    userId: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<UserProfile> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile'],
    });

    if (!user) {
      throw new HttpException(
        `User id: ${userId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (!user.profile) {
      throw new HttpException(
        `Profile not found for user id: ${userId}`,
        HttpStatus.NOT_FOUND,
      );
    }

    this.userProfileRepository.merge(user.profile, updateProfileDto);

    return this.userProfileRepository.save(user.profile);
  }

  async uploadAvatar(
    userId: number,
    file: Express.Multer.File,
  ): Promise<General.URL> {
    if (!file) {
      throw new HttpException('File not provided', HttpStatus.BAD_REQUEST);
    }

    const userProfile = await this.getProfileByUserId(userId);
    if (!userProfile) {
      throw new HttpException('User profile not found', HttpStatus.NOT_FOUND);
    }

    if (userProfile.avatar) {
      try {
        const filename = path.basename(new URL(userProfile.avatar).pathname);
        const { status } = await this.cdnProvider.deleteFile(
          filename,
          this.cdnAvatarPath,
        );

        if (status !== HttpStatus.OK) {
          this.logger.warn(
            `Failed to delete previous avatar: ${filename}, Status: ${status}`,
          );
        }
      } catch (error) {
        this.logger.error(`Error deleting previous avatar: ${error.message}`);
      }
    }

    const fileExtension = path.extname(file.originalname) || IMG_EXT_JPEG;
    const safeFilename = `${userId}${fileExtension}`;

    const {
      status,
      timestamp,
      files: [{ url }],
    } = await this.cdnProvider.uploadFile(
      { ...file, originalname: safeFilename },
      new CDNUploadOptions(this.cdnAvatarPath),
    );

    if (status !== HttpStatus.OK) {
      throw new HttpException(
        'Failed to upload avatar',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    userProfile.avatar = `${url}?v=${timestamp}`;
    await this.userProfileRepository.save(userProfile);

    return { url: userProfile.avatar };
  }

  async deleteAvatar(userId: number): Promise<void> {
    const userProfile = await this.getProfileByUserId(userId);
    if (!userProfile) {
      throw new HttpException('User profile not found', HttpStatus.NOT_FOUND);
    }

    if (userProfile.avatar) {
      try {
        const filename = path.basename(new URL(userProfile.avatar).pathname);
        const { status } = await this.cdnProvider.deleteFile(
          filename,
          this.cdnAvatarPath,
        );

        if (status !== HttpStatus.OK) {
          this.logger.warn(
            `Failed to delete previous avatar: ${filename}, Status: ${status}`,
          );
        }
      } catch (error) {
        this.logger.error(`Error deleting previous avatar: ${error.message}`);
      }
    }

    userProfile.avatar = null;
    await this.userProfileRepository.save(userProfile);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
}
