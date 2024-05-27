import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'product_types',
})
export class productType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200, unique: true })
  name: string;
}

export default productType;