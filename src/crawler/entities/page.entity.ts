import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Website } from './website.entity';
import { PageMetadata } from './page-metadata.entity';

@Entity({ name: 'pages' })
export class Page {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  page_url: string;

  @Column({ default: 'pending' })
  status: string;

  @ManyToOne(() => Website, (w) => w.pages, { onDelete: 'CASCADE' })
  website: Website;

  @OneToOne(() => PageMetadata, (meta) => meta.page)
  metadata: PageMetadata;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
