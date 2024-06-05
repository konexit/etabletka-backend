import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
  name: 'site_options',
})
export class SiteOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 125 })
  key: string;

  @Column({ length: 125 })
  title: string;

  @Column({ type: 'text', nullable: true })
  value: string;

  @Column({ length: 125 })
  type: string;

  @Column({ type: 'smallint' })
  primary: number;

  @Column({ type: 'smallint' })
  switchable: number;

  @Column({ name: 'active', type: 'smallint', default: 1 })
  isActive: number;

  @Column({ name: 'editable', type: 'smallint', default: 1 })
  isEditable: number;

  @Column({ type: 'int' })
  position: number;

  @Column({ length: 125 })
  group: string;

  @Column({ name: 'group_title', length: 125 })
  groupTitle: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
