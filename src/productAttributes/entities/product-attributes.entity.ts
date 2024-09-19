import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Type, SectionViews, TypeUI } from '../product-attributes.enum';

@Entity({
  name: 'product_attributes',
})
export class ProductAttributes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  key: string

  @Column({ type: 'jsonb' })
  name: JSON;

  @Column({
    type: 'enum',
    enum: Type,
    default: Type.CUSTOM,
  })
  type: Type;

  @Column({
    name: 'type_ui',
    type: 'enum',
    enum: TypeUI,
    default: TypeUI.Checkbox,
  })
  typeUI: TypeUI;

  @Column({
    name: 'section_views',
    type: 'enum',
    enum: SectionViews,
    array: true,
  })
  sectionViews: SectionViews[];

  @Column({ default: 0 })
  order: number;

  @Column({ default: false })
  filter: boolean;

  @Column({ name: 'filter_ui', default: false })
  filterUI: boolean;

  @Column({ type: 'jsonb', nullable: true })
  values: JSON;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
