import * as cheerio from 'cheerio';

export function extractSizeOptions(html: string) {
  const $ = cheerio.load(html);
  const sizes = [];

  $('#childProudcts option').each((_, el) => {
    const label = $(el).text().trim();
    const url = $(el).attr('value');

    if (url && label && !label.includes('Select')) {
      sizes.push({ label, url });
    }
  });

  return sizes;
}
