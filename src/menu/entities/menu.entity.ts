import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MenuItem } from '../../menuItem/entities/menuItem.entity';

@Entity({
  name: 'menus',
})
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'json' })
  title: JSON;

  @Column({ unique: true })
  slug: string;

  @Column({ unique: true })
  description: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => MenuItem, (menuItem) => menuItem.menu)
  menuItems: MenuItem[];
}
