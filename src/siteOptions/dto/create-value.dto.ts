import { IsNotEmpty } from 'class-validator';

interface AttributeValue {
  key: string;
  attributeValue: JSON;
}

export class CreateValue {
  @IsNotEmpty()
  attributeValue: AttributeValue;
}
