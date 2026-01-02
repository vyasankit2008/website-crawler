import { Controller, Post, Body } from '@nestjs/common';
import { CrawlerService } from './crawler.service';

@Controller('crawler')
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  /* ------------------------------
     REGISTER WEBSITE (SITEMAP)
  ------------------------------ */
  @Post('register')
  register(@Body('websiteUrl') websiteUrl: string) {
    return this.crawlerService.registerWebsite(websiteUrl);
  }

  /* ------------------------------
     DEBUG SINGLE PRODUCT + SIZES
  ------------------------------ */
  @Post('debug-page')
  debugPage(@Body('url') url: string) {
    return this.crawlerService.debugSingleProduct(url);
  }
}
