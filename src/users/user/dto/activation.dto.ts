import { IsString, IsNotEmpty, MinLength } from 'class-validator';
export class ActivationDto {
	@IsString()
	@IsNotEmpty()
	login: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(6)
	code: string;
}
