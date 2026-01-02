import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

import { Website } from './entities/website.entity';
import { Sitemap } from './entities/sitemap.entity';
import { Page } from './entities/page.entity';
import { PageMetadata } from './entities/page-metadata.entity';

import { loadPageHtml } from './utils/page-loader';
import { extractMetadata } from './utils/metadata-extractor';
import { extractSizeOptions } from './utils/size-extractor';

@Injectable()
export class CrawlerService {
  constructor(
    @InjectRepository(Website)
    private websiteRepo: Repository<Website>,

    @InjectRepository(Sitemap)
    private sitemapRepo: Repository<Sitemap>,

    @InjectRepository(Page)
    private pageRepo: Repository<Page>,

    @InjectRepository(PageMetadata)
    private metaRepo: Repository<PageMetadata>,
  ) {}

  /* ===================================================
     1️⃣ FETCH SITEMAP LINKS (YOUR OLD LOGIC – CLEANED)
  =================================================== */
  async fetchSitemapLinks(websiteUrl: string): Promise<string[]> {
    const baseUrl = websiteUrl.replace(/\/$/, '');

    const parser = new XMLParser({
      ignoreAttributes: false,
      removeNSPrefix: true,
    });

    const visited = new Set<string>();
    const urls = new Set<string>();

    const crawl = async (sitemapUrl: string) => {
      if (visited.has(sitemapUrl)) return;
      visited.add(sitemapUrl);

      const res = await axios.get(sitemapUrl, { timeout: 30000 });
      const finalUrl = (res.request as any)?.res?.responseUrl || sitemapUrl;

      const data = parser.parse(res.data);

      if (data.sitemapindex?.sitemap) {
        const list = Array.isArray(data.sitemapindex.sitemap)
          ? data.sitemapindex.sitemap
          : [data.sitemapindex.sitemap];

        for (const sm of list) {
          await crawl(new URL(sm.loc, finalUrl).href);
        }
      }

      if (data.urlset?.url) {
        const list = Array.isArray(data.urlset.url)
          ? data.urlset.url
          : [data.urlset.url];

        for (const u of list) {
          urls.add(new URL(u.loc, finalUrl).href);
        }
      }
    };

    try {
      await crawl(`${baseUrl}/sitemap.xml`);
      return urls.size ? Array.from(urls) : [baseUrl];
    } catch {
      return [baseUrl];
    }
  }

  /* ===================================================
     2️⃣ REGISTER WEBSITE + SAVE PAGES
  =================================================== */
  async registerWebsite(websiteUrl: string) {
    let website = await this.websiteRepo.findOne({
      where: { website_url: websiteUrl },
    });

    if (!website) {
      website = await this.websiteRepo.save({
        website_url: websiteUrl,
        status: 'pending',
      });
    }

    const sitemapUrl = `${websiteUrl.replace(/\/$/, '')}/sitemap.xml`;

    await this.sitemapRepo.save({
      sitemap_url: sitemapUrl,
      website,
    });

    const pageUrls = await this.fetchSitemapLinks(websiteUrl);

    for (const url of pageUrls) {
      const exists = await this.pageRepo.findOne({
        where: { page_url: url, website: { id: website.id } },
      });

      if (!exists) {
        await this.pageRepo.save({
          page_url: url,
          website,
          status: 'pending',
        });
      }
    }

    // Async crawl (non-blocking)
    // setImmediate(() => this.startCrawling(website.id));

    return {
      websiteId: website.id,
      pagesQueued: pageUrls.length,
      status: 'started',
    };
  }

  /* ===================================================
     3️⃣ START CRAWLING (PAGE LEVEL)
  =================================================== */
  async startCrawling(websiteId: number) {
    const pages = await this.pageRepo.find({
      where: {
        website: { id: websiteId },
        status: 'pending',
      },
      relations: ['website'],
    });

    for (const page of pages) {
      try {
        const html = await loadPageHtml(page.page_url);
        const data = extractMetadata(html);

        await this.metaRepo.save({
          page,
          metadata: data, // JSONB column
        });

        await this.pageRepo.update(page.id, { status: 'done' });
      } catch (err) {
        console.error('❌ Crawl failed:', page.page_url, err.message);
        await this.pageRepo.update(page.id, { status: 'failed' });
      }
    }

    await this.websiteRepo.update(websiteId, { status: 'completed' });
  }

  /* ===================================================
     4️⃣ DEBUG SINGLE PRODUCT + ALL SIZE VARIANTS
  =================================================== */
  async debugSingleProduct(url: string) {
    console.log('🔍 Base product:', url);

    const baseHtml = await loadPageHtml(url);
    const baseData = extractMetadata(baseHtml);

    const sizes = extractSizeOptions(baseHtml);

    const variants: Record<string, any> = {};

    for (const size of sizes) {
      console.log('➡ Crawling size variant:', size.label);

      const sizeHtml = await loadPageHtml(size.url);
      const sizeData = extractMetadata(sizeHtml);

      variants[size.label] = {
        url: size.url,
        data: sizeData,
      };
    }

    return {
      url,
      base: baseData,
      variants,
    };
  }
}
