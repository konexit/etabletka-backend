import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'another_points',
})
export class AnotherPoint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ name: 'cdn_data', type: 'json', nullable: true })
  cdnData: JSON;

  @Column({ name: 'active', default: true })
  isActive: boolean;

  @Column({ name: 'main_color', length: 7, default: '#ff0000' })
  mainColor: string;

  @Column({ name: 'back_color', length: 7, default: '#ffffff' })
  backColor: string;

  @Column({ name: 'num_color', length: 7, default: '#000000' })
  numColor: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
