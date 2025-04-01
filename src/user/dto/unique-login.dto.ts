import { IsString, IsNotEmpty } from 'class-validator';

export class UniqueLoginDto {
	@IsString()
	@IsNotEmpty()
	login: string;
}
