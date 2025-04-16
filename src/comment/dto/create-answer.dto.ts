import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';

export class CreateAnswerDto {
  @IsNotEmpty()
  @IsString()
  answer: string;

  @IsOptional()
  @IsBoolean()
  anonymous?: boolean;
}
