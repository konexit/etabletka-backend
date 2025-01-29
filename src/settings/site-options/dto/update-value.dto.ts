import { IsNotEmpty } from 'class-validator';

interface AttributeValue {
  key: string;
  attributeValue: JSON;
}

export class UpdateValue {
  @IsNotEmpty()
  attributeValue: AttributeValue;
}
