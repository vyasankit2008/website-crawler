import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrawlerController } from './crawler.controller';
import { CrawlerService } from './crawler.service';
import { Website } from './entities/website.entity';
import { Sitemap } from './entities/sitemap.entity';
import { Page } from './entities/page.entity';
import { PageMetadata } from './entities/page-metadata.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Website, Sitemap, Page, PageMetadata])],
  controllers: [CrawlerController],
  providers: [CrawlerService],
})
export class CrawlerModule {}
