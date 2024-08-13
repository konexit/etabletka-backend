import { IsObject, IsString, MinLength } from 'class-validator';

interface Characteristic {
  alias: string;
  filter: boolean;
  filterUI: boolean;
  isPreview: boolean;
  name: JSON;
  order: number;
  type: string;
  typeUI: string;
  values: Values[];
}

interface Values {
  icon: string;
  name: string;
  path: string;
  slug: string;
  color: string;
}

export class CreateCharacteristic {
  @IsString()
  @MinLength(1)
  key: string;

  @IsObject()
  attribute: Characteristic;
}
