import {
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserProfile {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsOptional()
  dateOfBirth: string;

  @IsJSON()
  @IsOptional()
  avatar: JSON;

  @IsJSON()
  @IsOptional()
  favoriteProducts: JSON;

  @IsJSON()
  @IsOptional()
  favoriteStores: JSON;
}
