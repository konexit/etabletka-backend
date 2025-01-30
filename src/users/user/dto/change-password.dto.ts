import { IsString, MinLength, IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
	@IsNotEmpty()
	@IsString()
	login: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(8)
	password: string;

	@MinLength(6)
	code: string;
}

export class PasswordRecoveryDto {
	@IsNotEmpty()
	@IsString()
	login: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(13)
	phone: string;
}
