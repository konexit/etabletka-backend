import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('banners')
export class Banner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 125 })
  name: string;

  @Column({ unique: true, length: 125 })
  slug: string;

  @Column({ name: 'btn_pos', length: 125 })
  btnPos: string;

  @Column({ name: 'show_title', default: false })
  showTitle: boolean;

  @Column({ name: 'cdn_data', type: 'json', nullable: true })
  cdnData: JSON;

  @Column({ length: 125, nullable: true })
  url: string;

  @Column({ name: 'published', default: false })
  isPublished: boolean;

  @Column({ name: 'publish_start', type: 'timestamp', nullable: true })
  publishStart: Date;

  @Column({ name: 'publish_end', type: 'timestamp', nullable: true })
  publishEnd: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
