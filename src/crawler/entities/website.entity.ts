import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Sitemap } from './sitemap.entity';
import { Page } from './page.entity';

@Entity({ name: 'websites' })
export class Website {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  website_url: string;

  @Column({ default: 'pending' })
  status: string;

  @OneToMany(() => Sitemap, (s) => s.website)
  sitemaps: Sitemap[];

  @OneToMany(() => Page, (p) => p.website)
  pages: Page[];
}
