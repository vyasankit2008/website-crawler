import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Website } from './website.entity';

@Entity({ name: 'sitemaps' })
export class Sitemap {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sitemap_url: string;

  @ManyToOne(() => Website, (w) => w.sitemaps, { onDelete: 'CASCADE' })
  website: Website;
}
