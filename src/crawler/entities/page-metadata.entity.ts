import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Page } from './page.entity';

@Entity({ name: 'page_metadata' })
export class PageMetadata {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Page, { onDelete: 'CASCADE' })
  @JoinColumn()
  page: Page;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any; // Main metadata object from extractMetadata()

  @Column({ type: 'jsonb', nullable: true })
  meta_json: any; // Legacy field (kept for backward compatibility)

  @Column({ type: 'jsonb', nullable: true })
  breadcrumbs_json: any;

  @Column({ type: 'jsonb', nullable: true })
  headings_json: any;

  @Column({ type: 'jsonb', nullable: true })
  tags_json: any;

  @CreateDateColumn()
  created_at: Date;
}
