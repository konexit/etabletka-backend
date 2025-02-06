import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { USER_PASSWORD_ACTIVATION_CODE_SIZE } from 'src/common/config/common.constants';
export class ActivationDto {
	@IsString()
	@IsNotEmpty()
	login: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(USER_PASSWORD_ACTIVATION_CODE_SIZE)
	code: string;
}

export class ActivationCodeDto {
	@IsNotEmpty()
	@IsString()
	login: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(13)
	phone: string;
}
