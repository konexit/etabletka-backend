import { LangContent } from 'src/common/types/common/general';
import {
  SearchFilterUIType,
  SearchIndexDataSource,
  SearchUISection,
  SearchUploadDataSource
} from 'src/common/types/search/search.enum';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity({
  name: 'product_attributes',
})
export class ProductAttributes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  key: string

  @Column({ type: 'jsonb' })
  name: LangContent;

  @Column({
    type: 'enum',
    enum: SearchUploadDataSource,
    default: SearchUploadDataSource.Custom,
  })
  type: SearchUploadDataSource;

  @Column({
    name: 'type_ui',
    type: 'enum',
    enum: SearchFilterUIType,
    default: SearchFilterUIType.Checkbox,
  })
  typeUI: SearchFilterUIType;

  @Column({
    name: 'type_source',
    type: 'enum',
    enum: SearchIndexDataSource,
    default: SearchIndexDataSource.Attributes,
  })
  typeSource: SearchIndexDataSource;

  @Column({
    name: 'section_views',
    type: 'enum',
    enum: SearchUISection,
    array: true,
  })
  sectionViews: SearchUISection[];

  @Column({
    name: 'merge_keys',
    type: 'varchar',
    array: true,
    default: {}
  })
  mergeKeys: string[];

  @Column({ default: 0 })
  order: number;

  @Column({ name: 'search_engine', default: false })
  searchEngine: boolean;

  @Column({ name: 'multiple_values', default: false })
  multipleValues: boolean;

  @Column({ name: 'ui', default: false })
  ui: boolean;

  @Column({ type: 'jsonb', nullable: true })
  values: JSON;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
