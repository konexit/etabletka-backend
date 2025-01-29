import { IsNotEmpty, MinLength } from 'class-validator';

interface AttributeValue {
  key: string;
  attributeValue: JSON;
}

export class CreateValue {
  @MinLength(1)
  key: string;

  @IsNotEmpty()
  attributeValue: AttributeValue;
}
