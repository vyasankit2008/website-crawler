import axios from 'axios';
import { parseStringPromise } from 'xml2js';

export async function parseSitemap(url: string): Promise<string[]> {
  const res = await axios.get(url);
  const xml = await parseStringPromise(res.data);

  if (xml.urlset) {
    return xml.urlset.url.map((u) => u.loc[0]);
  }

  if (xml.sitemapindex) {
    const nested = xml.sitemapindex.sitemap.map((s) => s.loc[0]);
    let urls = [];
    for (const s of nested) {
      urls.push(...(await parseSitemap(s)));
    }
    return urls;
  }

  return [];
}
