import { IsNotEmpty, IsNumber, IsJSON } from 'class-validator';
export class CreateProductDto {
  @IsNumber()
  @IsNotEmpty()
  sync_id: number;

  @IsJSON()
  @IsNotEmpty()
  name: JSON;

  @IsJSON()
  @IsNotEmpty()
  shortName: JSON;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}
export default CreateProductDto;
