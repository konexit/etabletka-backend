import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Menu } from './menu.entity';

@Entity({
  name: 'menu_items',
})
export class MenuItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'menu_id' })
  menuId: number;

  @Column({ type: 'json' })
  title: JSON;

  @Column({ length: 200 })
  slug: string;

  @Column({ length: 1000, nullable: true })
  url: string;

  @Column({ default: 0 })
  position: number;

  @Column({ name: 'active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Menu, (menu) => menu.menuItems)
  @JoinColumn({ name: 'menu_id', referencedColumnName: 'id' })
  menu: Menu;
}
