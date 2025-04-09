import * as dayjs from 'dayjs';
import { USER_MINIMUM_AGE } from 'src/common/config/common.constants';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  IsDate,
  MaxDate,
  IsNumber,
  IsArray,
  ValidateNested
} from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateProfileDto extends PartialType(CreateUserDto) {
  @MaxLength(50)
  @IsOptional()
  @IsString()
  firstName: string;

  @MaxLength(50)
  @IsOptional()
  @IsString()
  lastName: string;

  @MaxLength(50)
  @IsString()
  @IsOptional()
  middleName: string;

  @MaxLength(15)
  @IsOptional()
  @IsString()
  phone: string;

  @MaxLength(50)
  @IsOptional()
  @IsEmail()
  email: string;

  @Type(() => Date)
  @MaxDate(dayjs().subtract(USER_MINIMUM_AGE, 'year').toDate(), {
    message: `User must be at least ${USER_MINIMUM_AGE} years old`,
  })
  @IsOptional()
  @IsDate({ message: 'dateOfBirth must be a valid date' })
  dateOfBirth: Date;

  @IsOptional()
  @IsNumber()
  katottgId: number;

  @MaxLength(20)
  @IsOptional()
  @IsString()
  streetPrefix: string;

  @MaxLength(200)
  @IsOptional()
  @IsString()
  street: string;

  @MaxLength(10)
  @IsOptional()
  @IsString()
  house: string;

  @MaxLength(10)
  @IsOptional()
  @IsString()
  apartment: string;

  @MaxLength(10)
  @IsOptional()
  @IsString()
  floor: string;

  @IsOptional()
  @IsString()
  avatar: string;

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  favoriteProducts: number[];

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  comments: number[];

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  answers: number[];
}
