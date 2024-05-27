import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  firstName: string;
  lastName: string;
}
export default CreateUserDto;
