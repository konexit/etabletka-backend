import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity({
	name: 'categories',
})
export class Category {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ name: 'sync_id', unique: true })
	syncId: number;

	@Column({ name: 'parent_id', nullable: false, default: 0 })
	parentId: number;

	@Column({ type: 'json', nullable: true })
	name: JSON;

	@Column({ name: 'name_short', type: 'json', nullable: true })
	nameShort: JSON;

	@Column({ nullable: true })
	path: string;

	@Column({ nullable: true })
	slug: string;

	@Column({ type: 'json', nullable: true })
	description: JSON;

	@Column({ name: 'seo_h1', type: 'json', nullable: true })
	seoH1: JSON;

	@Column({ name: 'seo_title', type: 'json', nullable: true })
	seoTitle: JSON;

	@Column({ name: 'seo_description', type: 'json', nullable: true })
	seoDescription: JSON;

	@Column({ name: 'seo_keywords', type: 'json', nullable: true })
	seoKeywords: JSON;

	@Column({ name: 'seo_text', type: 'json', nullable: true })
	seoText: JSON;

	@Column({ nullable: true })
	image: string

	@Column({ name: 'cdn_icon', nullable: true })
	cdnIcon: string

	@Column({ nullable: true })
	icon: string

	@Column({ type: 'json', nullable: true })
	alt: JSON

	@Column({ default: 0 })
	position: number;

	@Column({ type: 'json', default: true })
	active: boolean;

	@Column({ name: 'show_menu', type: 'boolean', default: true })
	showMenu: JSON;
}
