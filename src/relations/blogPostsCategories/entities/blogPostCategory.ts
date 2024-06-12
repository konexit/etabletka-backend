import { Entity, Column } from 'typeorm';

@Entity({
  name: 'blog_posts_categories',
})
export class BlogPostCategory {
  @Column({ name: 'post_id' })
  postId: number;

  @Column({ name: 'category_id' })
  categoryId: number;
}
