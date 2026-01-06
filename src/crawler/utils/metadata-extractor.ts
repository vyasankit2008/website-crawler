import * as cheerio from 'cheerio';

export function extractMetadata(html: string) {
  const $ = cheerio.load(html);

  /* ---------------- BASIC META ---------------- */
  const title = $('title').text().trim();
  const metaDescription =
    $('meta[name="description"]').attr('content')?.trim() || '';

  /* ---------------- BREADCRUMBS ---------------- */
  const crumbs: string[] = [];
  $('.breadcrumbs .breadcrumb-label span').each((_, el) => {
    const t = $(el).text().trim();
    if (t && t.toLowerCase() !== 'home') crumbs.push(t);
  });

  const breadcrumbs = {
    type: crumbs[0] || null,
    sub_types: crumbs.slice(1),
  };

  /* ---------------- PRODUCT HEADER ---------------- */
  const productTitle = $('.productView-title').first().text().trim();
  const brand = $('.productView-brand span').first().text().trim();

  /* ---------------- PRODUCT INFO ---------------- */
  const productInfo: Record<string, string> = {};

  $('.productView-info dt').each((_, dt) => {
    const key = $(dt)
      .text()
      .replace(':', '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_');

    const value = $(dt).next('dd').text().trim();
    if (key && value) productInfo[key] = value;
  });

  /* ---------------- DESCRIPTION ---------------- */
  const descriptionHtml = $('#tab-description').html()?.trim() || '';
  const descriptionText = $('#tab-description').text().trim();

  /* ---------------- TECH SPECS ---------------- */
  const specs: Record<string, string> = {};

  $('#tab-description .row').each((_, row) => {
    const key = $(row).find('.left').text().trim();
    const value = $(row).find('.right').text().trim();
    if (key && value) specs[key] = value;
  });

  /* ---------------- CUSTOM FIELDS (Other Details) ---------------- */
  const customFields: Record<string, string> = {};

  $('#custom_fields dt').each((_, dt) => {
    const key = $(dt)
      .text()
      .replace(':', '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');

    const value = $(dt).next('dd').text().trim();
    if (key && value) customFields[key] = value;
  });

  /* ---------------- VIDEOS ---------------- */
  const videos: Array<{
    videoId: string;
    embedUrl: string;
    thumbnail: string;
    title: string;
    description: string;
  }> = [];

  $('#tab-video .videoGallery-item').each((_, el) => {
    const videoId = $(el).find('[data-video-id]').attr('data-video-id') || '';
    if (!videoId) return;

    videos.push({
      videoId,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      thumbnail:
        $(el).find('img').attr('data-src') ||
        $(el).find('img').attr('src') ||
        '',
      title: $(el).find('.video-title').text().trim(),
      description: $(el).find('.video-description').text().trim(),
    });
  });

  /* ---------------- PRICING ---------------- */
  const msrp = $('.price--rrp').text().replace('MSRP:', '').trim();
  const price = $('[data-product-price-without-tax]').text().trim();
  const save = $('[data-product-price-saved]').text().trim();

  /* ---------------- FINAL STRUCTURE ---------------- */
  return {
    title,
    metaDescription,
    breadcrumbs,

    product: {
      title: productTitle,
      brand,
      ...productInfo,
    },
    specs,
    other_details: customFields,
    pricing: {
      msrp,
      price,
      save,
    },
    media: {
      videos,
    },
    description: {
      text: descriptionText,
      html: descriptionHtml,
    },
  };
}
